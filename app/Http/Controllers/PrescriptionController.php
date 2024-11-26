<?php

namespace App\Http\Controllers;

use App\Models\Order;
use App\Models\Customer;
use Illuminate\Support\Str;
use App\Models\Prescription;
use Illuminate\Http\Request;
use App\Models\CustomerLogin;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Storage;

class PrescriptionController extends Controller
{

    public function get_customer(Request $request)
    {
        $token = $request->header('Authorization') ? explode(' ', $request->header('Authorization'))[1] : null;
        if (!$token) {
            return response()->json(['error' => 'Token is required'], 401);
        }

        $customerLogin = CustomerLogin::where('token', $token)->first();
        if (!$customerLogin) {
            return response()->json(['error' => 'Invalid token'], 401);
        }

        if ($customerLogin->token_expired_at && $customerLogin->token_expired_at < now()) {
            return response()->json(['error' => 'Token has expired'], 401);
        }

        $customer = $customerLogin->customer()->first();
        return $customer;
    }



    public function prescription_upload(Request $request)
    {
        $customer = $this->get_customer($request);
        if (!$customer instanceof Customer) {
            return $customer;
        }

        // Validate input
        $validatedData = $request->validate([
            'images' => 'required|array',
            'images.*' => 'file|mimes:jpeg,jpg,png|max:2048',
            'status' => 'required|in:pending,assigned,unassigned',
            'instructions'=> 'nullable'
        ]);

        $order_id = null;

        // Check for an existing pending or unassigned prescription
        if (in_array($validatedData['status'], ['pending', 'unassigned'])) {
            $existingPrescription = Prescription::where('customer_id', $customer->id)
                ->where('status', $validatedData['status'])
                ->first();

            if ($existingPrescription) {
                $this->delete_prescription_group($existingPrescription->group_code);
            }
        } elseif ($validatedData['status'] == 'assigned' && $request->order_code) {
            $order = Order::where('order_code', $request->order_code)->first();

            if (!$order) {
                return response()->json(['message' => 'Order not found'], 404);
            }

            $order_id = $order->id;

            // Check for existing assigned prescription
            $assignedPrescription = Prescription::where('order_id', $order->id)->first();
            if ($assignedPrescription) {
                $this->delete_prescription_group($assignedPrescription->group_code);
            }
        }

        // Generate a unique group_code for the prescriptions
        $groupCode = (string) Str::uuid() ?? bin2hex(random_bytes(16));

        // Start a new database transaction
        DB::beginTransaction();

        try {
            // Process each image
            $prescriptions = [];
            foreach ($validatedData['images'] as $index => $image) {
                // Store image
                $imagePath = $image->store('prescriptions', 'public');

                // Create prescription entry in the database
                $prescription = Prescription::create([
                    'customer_id' => $customer->id,
                    'file_path' => $imagePath,
                    'instructions' => $validatedData['instructions'],
                    'status' => $validatedData['status'],
                    'group_code' => $groupCode,
                    'order_id' => $order_id,
                    'page' => $index + 1,
                ]);

                if (!$prescription) {
                    // Rollback the transaction if any item fails to upload
                    DB::rollBack();
                    return response()->json(['message' => 'Failed to upload prescription'], 400);
                }

                $prescriptions[] = $prescription;
            }

            // Commit the transaction if all items are successfully uploaded
            DB::commit();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json(['message' => 'Failed to upload prescription'], 500);
        }

        return response()->json(['message' => 'Prescriptions uploaded successfully'], 201);
    }

    /**
     * Delete all prescriptions associated with the given group_code.
     */
    private function delete_prescription_group($group_code)
    {
        $prescGroup = Prescription::where('group_code', $group_code)->get();
        foreach ($prescGroup as $presc) {
            Storage::disk('public')->delete($presc->file_path);
            $presc->delete();
        }
    }


    public function get_pending_item(Request $request)
    {
        $customer = $this->get_customer($request);
        if (!$customer instanceof Customer) {
            return $customer;
        }

        $pendingItem = Prescription::where('customer_id', $customer->id)
            ->where('status', 'pending')
            ->first();
        if ($pendingItem) {
            return response()->json($pendingItem, 200);
        }
        return response()->json(['message', 'Not found !'], 404);
    }

    public function get_group_items(Request $request)
    {
        $customer = $this->get_customer($request);
        if (!$customer instanceof Customer) {
            return $customer;
        }

        $pendingItem = Prescription::where('customer_id', $customer->id)
            ->where('status', 'pending')
            ->orWhere('status', 'unassigned')
            ->first();

        $prescs = Prescription::where('group_code', $pendingItem->group_code)->orderBy('page', 'asc')->get();

        if ($prescs) {
            return response()->json($prescs, 200);
        }
        return response()->json(['message', 'Not found !'], 404);
    }

    public function get_unassigned_items()
    {
        $items = Prescription::where('status', 'unassigned')->with(['customer.addresses'])->get()
            ->groupBy('group_code');

        if ($items) {
            $result = [];
            foreach ($items as $groupCode => $prescriptions) {
                $result[] = [
                    'group_code' => $groupCode,
                    'prescriptions' => $prescriptions
                ];
            }
            return response()->json($result, 200);
        }
        return response()->json(['message' => 'Not found!'], 404);
        
    }

    public function get_group_all(Request $request)
    {
        $customer = $this->get_customer($request);
        if (!$customer instanceof Customer) {
            return $customer;
        }

        $items = Prescription::where('customer_id', $customer->id)
            ->get()
            ->groupBy('group_code');

        if ($items) {
            // Restructure the grouped data into an array of objects
            $result = [];
            foreach ($items as $groupCode => $prescriptions) {
                $result[] = [
                    'group_code' => $groupCode,
                    'prescriptions' => $prescriptions
                ];
            }
            return response()->json($result, 200);
        }
        return response()->json(['message' => 'Not found!'], 404);
    }

    public function items_by_group(Request $request)
    {
        $customer = $this->get_customer($request);
        if (!$customer instanceof Customer) {
            return $customer;
        }

        $prescs = Prescription::where('group_code', $request->group_code)->orderBy('page', 'asc')->get();

        if ($prescs) {
            return response()->json($prescs, 200);
        }
        return response()->json(['message', 'Not found !'], 404);
    }

    public function precription_by_order(Request $request, Order $order)
    {
        $prescs = Prescription::where('order_id', $order->id)->orderBy('page', 'asc')->get();

        if ($prescs) {
            return response()->json($prescs, 200);
        }
        return response()->json(['message', 'Not found !'], 404);
    }
}
