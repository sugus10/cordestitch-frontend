"use client";
import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { Loader2, Trash2, Edit, X, Plus, Home, Briefcase, AlertCircle } from "lucide-react";
import { toast } from 'sonner';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card } from "@/components/ui/card";
import { useAddressAPIService } from "@/app/services/data.service";

export interface Address {
  _id?: string; // To match API response
  addressId?: string;
  id: string; // Changed from number to string to match _id
  firstName: string;
  lastName: string;
  phoneNumber: string;
  pinCode: string;
  buildingName: string;
  streetName: string;
  district: string;
  state: string;
  country?: string;
  landMark?: string;
  altPhone?: string; // Changed to optional
  isDefault: boolean;
  typeOfAddress: string;
  addressType?: string; // To match API response
}


const addressValidationSchema = Yup.object().shape({
  firstName: Yup.string().required("First name is required"),
  lastName: Yup.string().required("Last name is required"),
  phoneNumber: Yup.string()
    .matches(/^[0-9]{10}$/, "Phone number must be 10 digits")
    .required("Phone number is required"),
  pinCode: Yup.string().required("Pincode is required"),
  buildingName: Yup.string().required("Building name is required"),
  streetName: Yup.string().required("Street name is required"),
  cityName: Yup.string().required("City name is required"),
  stateName: Yup.string().required("State name is required"),
  landmark: Yup.string(),
  altPhone: Yup.string(),
});

const ManageAddress = () => {
  const [selectedAddress, setSelectedAddress] = React.useState<Address | null>(null);
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [pincode, setPincode] = useState("");
  const [state, setState] = useState("");
  const [district, setDistrict] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPincodeDetails = async (pincode: string) => {
    setLoading(true);
    setError("");

    const pincodeApiUrl = process.env.NEXT_PUBLIC_PINCODE_API_KEY;

    if (!pincodeApiUrl) {
      setError("API base URL is not configured.");
      setLoading(false);
      return;
    }

    const url = `${pincodeApiUrl}${pincode}`;

    try {
      const response = await axios.get(url);
      const data = response.data[0];

      if (data.Status === "Success") {
        const postOffice = data.PostOffice[0];
        setState(postOffice.State);
        setDistrict(postOffice.District);
        formikFn.setFieldValue("stateName", postOffice.State);
        formikFn.setFieldValue("cityName", postOffice.District);
        formikFn.setFieldValue("countryName", "India");
      } else {
        setError("Invalid Pincode. Please check again.");
        setState("");
        setDistrict("");
      }
    } catch (error) {
      console.error("Error fetching pincode details:", error);
      setError("Failed to fetch pincode details. Please try again later.");
      setState("");
      setDistrict("");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (district && state) {
      formikFn.setValues({
        ...formikFn.values,
        district: district,
        state: state,
      });
    }
  }, [district, state]);

  const formikFn = useFormik({
    enableReinitialize: true,
    initialValues: {
      firstName: "",
      lastName: "",
      phoneNumber: "",
      pinCode: "",
      buildingName: "",
      streetName: "",
      district: "",
      state: "",
      country: "India",
      landmark: "",
      altPhone: "",
      isDefault: false,
      typeOfAddress: "home",
    },
    validationSchema: addressValidationSchema,
    onSubmit: async (values) => {
      try {
        const updatedData = {
          firstName: values.firstName,
          lastName: values.lastName,
          phoneNumber: values.phoneNumber,
          pinCode: values.pinCode,
          buildingName: values.buildingName,
          streetName: values.streetName,
          district: values.district,
          state: values.state,
          country: values.country,
          landMark: values.landmark || null,
          alternatePhoneNumber: values.altPhone || null,
          addressType: values.typeOfAddress,
          isDefault: values.isDefault
        };
    
        if (isEditing && editingIndex !== null) {
          const addressId = addresses[editingIndex]?.addressId;
          if (!addressId) {
            console.error("Missing address ID at editingIndex", editingIndex);
            throw new Error("Address ID is missing");
          }
    
          await updateAddress(addressId, updatedData);
          toast.success("Address updated successfully");
        } else {
          await addAddress(updatedData);
          toast.success("Address added successfully");
        }
    
        await loadAddresses();
        resetForm();
      } catch (error) {
        console.error("Error saving address:", error);
        toast.error("Failed to save address");
      }
    }
    
    
  });

  const { getAddresses } = useAddressAPIService();

  const loadAddresses = async () => {
    try {
      const response = await getAddresses();
      // Transform the API data to match your Address interface
      const formattedAddresses = response.data.map((address: any) => ({
        addressId: address._id,
        id: address._id, // or generate a unique ID if needed
        firstName: address.firstName,
        lastName: address.lastName,
        phoneNumber: address.phoneNumber,
        pinCode: address.pinCode,
        buildingName: address.buildingName,
        streetName: address.streetName,
        district: address.district,
        state: address.state,
        country: address.country,
        landMark: address.landMark,
        altPhone: address.alternatePhoneNumber,
        isDefault: address.isDefault || false, // Add default if missing
        typeOfAddress: address.addressType || "home" // Default to HOME if missing
      }));
      setAddresses(formattedAddresses);
    } catch (error) {
      console.error("Failed to load addresses:", error);
      toast.error("Failed to load addresses");
      setAddresses([]);
    }
  };
  useEffect(() => {
    loadAddresses();
  }, []);

  const { addAddress, updateAddress, deleteAddress } = useAddressAPIService();

  const resetForm = () => {
    setShowForm(false);
    setIsEditing(false);
    setEditingIndex(null);
    formikFn.resetForm();
    setState("");
    setDistrict("");
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    setIsEditing(true);
    setShowForm(true);
    const selectedAddress = addresses[index];

    formikFn.setValues({
      firstName: selectedAddress.firstName || "",
      lastName: selectedAddress.lastName || "",
      phoneNumber: selectedAddress.phoneNumber || "",
      pinCode: selectedAddress.pinCode || "",
      buildingName: selectedAddress.buildingName || "",
      streetName: selectedAddress.streetName || "",
      district: selectedAddress.district || "",
      state: selectedAddress.state || "",
      country: "India",
      landmark: selectedAddress.landMark || "",
      altPhone: selectedAddress.altPhone || "",
      isDefault: selectedAddress.isDefault || false,
      typeOfAddress: selectedAddress.typeOfAddress || "home",
    });
  };

  const handleRemove = async (addressId: string) => {
    try {
      await deleteAddress(addressId);
      toast.success("Address removed successfully");
      setAddresses(addresses.filter((address) => address.addressId !== addressId));
    } catch (error) {
      console.error("Error deleting address:", error);
      toast.error("Failed to delete address");
    }
  };

  const handlePincodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputPincode = e.target.value;
    if (/^\d{0,6}$/.test(inputPincode)) {
      setPincode(inputPincode);
      setError("");
      formikFn.setFieldValue("pinCode", inputPincode);
      if (inputPincode.length === 6) {
        fetchPincodeDetails(inputPincode);
      } else {
        setState("");
        setDistrict("");
        formikFn.setFieldValue("stateName", "");
        formikFn.setFieldValue("cityName", "");
      }
    } else {
      setError("Pincode must be numeric and 6 digits long.");
    }
  };

  const handleNameInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const regex = /^[A-Za-z\s]*$/;
    if (!regex.test(e.key)) {
      e.preventDefault();
    }
  };

  const handlePhoneInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const regex = /^[0-9]*$/;
    if (!regex.test(e.key)) {
      e.preventDefault();
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Manage Addresses</h1>
        <Button
          onClick={() => {
            if (showForm) {
              resetForm();
            } else {
              setShowForm(true);
            }
          }}
          variant={showForm ? "outline" : "default"}
          className="flex items-center gap-2"
        >
          {showForm ? (
            <>
              <X className="h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <Plus className="h-4 w-4" />
              Add Address
            </>
          )}
        </Button>
      </div>

      {showForm && (
          <form onSubmit={formikFn.handleSubmit} className="max-w-2xl  bg-white     w-full mx-auto  p-6 rounded-lg shadow-sm">
  {/* Max address limit warning */}
  {showForm && !isEditing && addresses.length >= 5 && (
    <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded-md mb-6 flex items-center">
      <AlertCircle className="h-5 w-5 mr-2 flex-shrink-0" />
      <span>You've reached the maximum limit of 5 addresses. Please delete an existing address to save a new one.</span>
    </div>
  )}

  <div className="space-y-6">
    {/* Name Fields */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="firstName" className="font-medium">First Name</Label>
        <Input
          id="firstName"
          name="firstName"
          value={formikFn.values.firstName}
          onChange={formikFn.handleChange}
          onKeyPress={handleNameInput}
          className="w-full"
        />
        {formikFn.touched.firstName && formikFn.errors.firstName && (
          <p className="text-sm text-red-500 mt-1">{formikFn.errors.firstName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="lastName" className="font-medium">Last Name</Label>
        <Input
          id="lastName"
          name="lastName"
          value={formikFn.values.lastName}
          onChange={formikFn.handleChange}
          onKeyPress={handleNameInput}
          className="w-full"
        />
        {formikFn.touched.lastName && formikFn.errors.lastName && (
          <p className="text-sm text-red-500 mt-1">{formikFn.errors.lastName}</p>
        )}
      </div>
    </div>

    {/* Phone Number */}
    <div className="space-y-2">
      <Label htmlFor="phoneNumber" className="font-medium">10-digit mobile number</Label>
      <Input
        id="phoneNumber"
        name="phoneNumber"
        value={formikFn.values.phoneNumber}
        onChange={formikFn.handleChange}
        maxLength={10}
        onKeyPress={handlePhoneInput}
        className="w-full"
      />
      {formikFn.touched.phoneNumber && formikFn.errors.phoneNumber && (
        <p className="text-sm text-red-500 mt-1">{formikFn.errors.phoneNumber}</p>
      )}
    </div>

    {/* Street and Building */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="streetName" className="font-medium">Street Name</Label>
        <Input
          id="streetName"
          name="streetName"
          value={formikFn.values.streetName}
          onChange={formikFn.handleChange}
          className="w-full"
        />
        {formikFn.touched.streetName && formikFn.errors.streetName && (
          <p className="text-sm text-red-500 mt-1">{formikFn.errors.streetName}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="buildingName" className="font-medium">Building Name</Label>
        <Input
          id="buildingName"
          name="buildingName"
          value={formikFn.values.buildingName}
          onChange={formikFn.handleChange}
          className="w-full"
        />
        {formikFn.touched.buildingName && formikFn.errors.buildingName && (
          <p className="text-sm text-red-500 mt-1">{formikFn.errors.buildingName}</p>
        )}
      </div>
    </div>

    {/* Pincode */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="pinCode" className="font-medium">Pincode</Label>
        <Input
          id="pinCode"
          name="pinCode"
          maxLength={6}
          value={formikFn.values.pinCode}
          onKeyPress={handlePhoneInput}
          onChange={(e) => {
            formikFn.handleChange(e);
            handlePincodeChange(e);
          }}
          className="w-full"
        />
        {formikFn.touched.pinCode && formikFn.errors.pinCode && (
          <p className="text-sm text-red-500 mt-1">{formikFn.errors.pinCode}</p>
        )}
        {loading && (
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <Loader2 className="h-4 w-4 animate-spin mr-2" />
            <span>Fetching location details...</span>
          </div>
        )}
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    </div>

    {/* State and District */}
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="stateName" className="font-medium">State</Label>
        <Input
          id="stateName"
          name="stateName"
          readOnly
          value={formikFn.values.state || state}
          onChange={formikFn.handleChange}
          className="w-full bg-gray-50"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="cityName" className="font-medium">District</Label>
        <Input
          id="cityName"
          name="cityName"
          readOnly
          value={formikFn.values.district || district}
          onChange={formikFn.handleChange}
          className="w-full bg-gray-50"
        />
      </div>
    </div>

    {/* Country */}
    <div className="space-y-2">
      <Label htmlFor="countryName" className="font-medium">Country</Label>
      <Input
        id="countryName"
        name="countryName"
        readOnly
        value={formikFn.values.country || "India"}
        onChange={formikFn.handleChange}
        className="w-full bg-gray-50"
      />
    </div>

    {/* Landmark */}
    <div className="space-y-2">
      <Label htmlFor="landmark" className="font-medium">Landmark (Optional)</Label>
      <Input
        id="landmark"
        name="landmark"
        value={formikFn.values.landmark}
        onChange={formikFn.handleChange}
        className="w-full"
      />
      {formikFn.touched.landmark && formikFn.errors.landmark && (
        <p className="text-sm text-red-500 mt-1">{formikFn.errors.landmark}</p>
      )}
    </div>

    {/* Alternate Phone */}
    <div className="space-y-2">
      <Label htmlFor="altPhone" className="font-medium">Alternate Phone (Optional)</Label>
      <Input
        id="altPhone"
        name="altPhone"
        value={formikFn.values.altPhone ?? ""}
        onChange={formikFn.handleChange}
        onKeyPress={handlePhoneInput}
        maxLength={10}
        className="w-full"
      />
      {formikFn.touched.altPhone && formikFn.errors.altPhone && (
        <p className="text-sm text-red-500 mt-1">{formikFn.errors.altPhone}</p>
      )}
    </div>

    {/* Address Type */}
    <div className="space-y-3">
      <Label className="font-medium">Address Type</Label>
      <RadioGroup
        defaultValue="home"
        value={formikFn.values.typeOfAddress}
        onValueChange={(value) => formikFn.setFieldValue("typeOfAddress", value)}
        className="flex gap-6"
      >
        <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-md">
          <RadioGroupItem value="home" id="home" />
          <Label htmlFor="home" className="flex items-center gap-2 cursor-pointer">
            <Home className="h-4 w-4 text-blue-500" />
            Home
          </Label>
        </div>
        <div className="flex items-center space-x-2 bg-gray-50 px-4 py-2 rounded-md">
          <RadioGroupItem value="work" id="work" />
          <Label htmlFor="work" className="flex items-center gap-2 cursor-pointer">
            <Briefcase className="h-4 w-4 text-blue-500" />
            Work
          </Label>
        </div>
      </RadioGroup>
    </div>

    {/* Action Buttons */}
    <div className="flex gap-4 pt-2">
    <Button 
      type="submit" 
      disabled={addresses.length >= 5 && !isEditing}
      className="px-6 cursor-pointer"
    >
      {isEditing ? "Update Address" : "Save Address"}
    </Button>
    <Button 
      type="button" 
      variant="outline" 
      onClick={resetForm}
      className="px-6"
    >
      Cancel
    </Button>
    </div>
  </div>
</form>
      )}

      {!showForm && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {addresses.length === 0 ? (
            <div className="col-span-2 flex flex-col items-center justify-center py-12">
              <div className="bg-gray-100 p-8 rounded-full mb-4">
                <Home className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">No addresses saved</h3>
              <p className="text-gray-500 mb-6">Add your first address to get started</p>
              <Button onClick={() => setShowForm(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Address
              </Button>
            </div>
          ) : (
            addresses.map((address, index) => (
              <Card
                key={address.addressId}
                className={`p-6 relative ${address.isDefault ? "border-2 border-primary" : ""}`}
              >
                <div className="absolute top-4 right-4 flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(index)}
                    className="h-8 w-8"
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(address.addressId!)}
                    className="h-8 w-8 text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-start gap-3 mb-4">
                  {address.typeOfAddress === "home" ? (
                    <Home className="h-5 w-5 text-primary" />
                  ) : (
                    <Briefcase className="h-5 w-5 text-primary" />
                  )}
                  <div>
                    <h3 className="font-medium capitalize">{address.typeOfAddress.toLowerCase()}</h3>
                    {address.isDefault && (
                      <span className="inline-block bg-primary text-primary-foreground text-xs px-2 py-0.5 rounded-full ml-2">
                        Default
                      </span>
                    )}
                  </div>
                </div>

                <div className="space-y-2 text-sm">
                  <p>
                    <span className="font-medium">{address.firstName} {address.lastName}</span>
                  </p>
                  <p>{address.phoneNumber}</p>
                  <p>{address.buildingName}, {address.streetName}</p>
                  <p>
                    {address.district}, {address.state} - {address.pinCode}
                  </p>
                  <p>{address.country}</p>
                  {address.landMark && (
                    <p className="text-gray-500">Landmark: {address.landMark}</p>
                  )}
                </div>
              </Card>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ManageAddress;