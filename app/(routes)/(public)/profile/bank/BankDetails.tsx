"use client";
import React, { useCallback, useEffect, useState } from "react";
import { FaTrash, FaPlus, FaTimes, FaCheck, FaEdit } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import {
  deleteBankDetails,
  getBankDetails,
  saveBankDetails,
  updateBankDetails,
} from "@/app/services/data.service";
import Image from "next/image";
import { toast } from "sonner";
import { RiDeleteBin6Line } from "react-icons/ri";
import { MdEditDocument } from "react-icons/md";

export interface BankDetail {
  bankName: string;
  accountNumber: string;
  accountHolderName: string;
  ifscCode: string;
  _id: string;  // Changed from userBankId to _id to match API response
}


const BankDetails = () => {
  const [bankDetails, setBankDetails] = useState<BankDetail[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [currentEditId, setCurrentEditId] = useState<string | null>(null);

 
  const [formData, setFormData] = useState<BankDetail>({
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
    ifscCode: "",
    _id: "",
  });


  const [error, setError] = useState<string>("");

  // Input handlers
  const handleBankNameInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.key;
    if (!/^[A-Za-z]$/.test(value)) {
      e.preventDefault();
    }
  };

  const handleAccountHolderNameInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.key;
    if (!/^[A-Za-z\s]*$/.test(value)) {
      e.preventDefault();
    }
  };

  const handleIfscCodeInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.key;
    // Allow alphanumeric characters and backspace
    if (!/[A-Za-z0-9]/.test(value) && value !== 'Backspace') {
      e.preventDefault();
    }
  };

  const handleAccountNumberInput = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const value = e.key;
    if (!/^[0-9]$/.test(value)) {
      e.preventDefault();
    }
  };

  // Form validation
  const validateForm = (): boolean => {
    const { bankName, accountNumber, accountHolderName, ifscCode } = formData;

    if (!/^[A-Za-z\s]+$/.test(bankName)) {
      setError("Bank name can only contain letters and spaces.");
      return false;
    }

    if (!/^[0-9]{9,18}$/.test(accountNumber)) {
      setError("Account number must be numeric and between 9 to 18 digits.");
      return false;
    }

    if (!/^[A-Za-z\s]+$/.test(accountHolderName)) {
      setError("Account holder name can only contain letters and spaces.");
      return false;
    }

    if (!/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(ifscCode)) {
      setError("Please enter a valid IFSC code.");
      return false;
    }

    setError("");
    return true;
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });

    let fieldError = "";

    switch (name) {
      case "bankName":
        if (!/^[A-Za-z\s]+$/.test(value)) {
          fieldError = "Bank name can only contain letters and spaces.";
        }
        break;
      case "accountNumber":
        if (!/^[0-9]{9,18}$/.test(value)) {
          fieldError = "Account number must be numeric and between 9 to 18 digits.";
        }
        break;
      case "accountHolderName":
        if (!/^[A-Za-z\s]+$/.test(value)) {
          fieldError = "Account holder name can only contain letters and spaces.";
        }
        break;
      case "ifscCode":
        if (!/^[A-Za-z]{4}0[A-Za-z0-9]{6}$/.test(value)) {
          fieldError = "Enter a valid 11-character IFSC code: 4 uppercase letters, '0' as the 5th, and 6 alphanumeric characters.";
        }
        break;
      default:
        break;
    }

    setError(fieldError);
  };

  // Fetch bank details
  const memoizedGetBankDetails = useCallback(async () => {
    try {
      const response = await getBankDetails();
      if (response && response.data && Array.isArray(response.data)) {
        return response.data;
      }
      throw new Error("Invalid response structure");
    } catch (error) {
      console.error("Error fetching bank details:", error);
      throw error;
    }
  }, []);

  useEffect(() => {
    const fetchBankDetails = async () => {
      try {
        const data = await memoizedGetBankDetails();
        setBankDetails(data);
      } catch (error) {
        setError("Error fetching bank details. Please try again.");
      }
    };

    fetchBankDetails();
  }, [memoizedGetBankDetails]);

  // Save bank details
  const handleAddBankDetails = async () => {
    if (!validateForm()) return;

    try {
      const response = await saveBankDetails(formData);
      if (response) {
        const updatedBankDetails = await getBankDetails();
        if (updatedBankDetails && Array.isArray(updatedBankDetails)) {
          setBankDetails(updatedBankDetails);
        } else {
          setError("Failed to load updated bank details.");
        }

        resetForm();
        toast.success("Bank details added successfully!");
      } else {
        setError("Failed to save bank details.");
      }
    } catch (error) {
      setError("Error saving bank details. Please try again.");
    }
  };

  // Update bank details
  const handleUpdateBankDetails = async () => {
    if (!validateForm() || !currentEditId) return;

    try {
      const { _id, ...updateData } = formData;
      const response = await updateBankDetails(currentEditId, {
        bankName: updateData.bankName,
        accountHolderName: updateData.accountHolderName,
        accountNumber: updateData.accountNumber,
        ifscCode: updateData.ifscCode,
      });

      if (response ) {
        const updatedBankDetails = await memoizedGetBankDetails();
        setBankDetails(updatedBankDetails);
        resetForm();
        toast.success("Bank details updated successfully!");
      } else {
        setError("Failed to update bank details.");
      }
    } catch (error) {
      setError("Error updating bank details. Please try again.");
    }
  };

  // Delete bank details
  const handleDeleteBankDetails = async (userBankId: string, index: number) => {
    try {
      const response = await deleteBankDetails(userBankId);
      if (response) {
        setBankDetails(bankDetails.filter((_, i) => i !== index));
        toast.success("Bank details deleted successfully!");
      } else {
        setError("Failed to delete the bank details.");
      }
    } catch (error) {
      setError("Error deleting bank details. Please try again.");
    }
  };

  // Edit bank details
  const handleEditBankDetails = (detail: BankDetail) => {
    setFormData({
      bankName: detail.bankName,
      accountNumber: detail.accountNumber,
      accountHolderName: detail.accountHolderName,
      ifscCode: detail.ifscCode,
      _id: detail._id,
    });
    setCurrentEditId(detail._id);
    setIsEditing(true);
    setShowForm(true);
  };


  // Reset form
  const resetForm = () => {
    setFormData({
      bankName: "",
      accountNumber: "",
      accountHolderName: "",
      ifscCode: "",
      _id: "",
    });
    setShowForm(false);
    setIsEditing(false);
    setCurrentEditId(null);
    setError("");
  };

  // Animation variants
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    exit: { opacity: 0, x: -50 },
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Bank Accounts</h1>
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#3b3b3b] hover:[#3b3b3b] text-white px-4 py-2 rounded-lg shadow-md transition-colors"
          >
            <FaPlus /> Add Bank
          </motion.button>
        )}
      </div>

      {/* Add/Edit Bank Form */}
      <AnimatePresence>
        {showForm && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8 border border-gray-200"
          >
            <h2 className="text-xl font-semibold mb-4">
              {isEditing ? "Edit Bank Details" : "Add New Bank Account"}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Bank Name
                </label>
                <input
                  type="text"
                  name="bankName"
                  placeholder="e.g. State Bank of India"
                  value={formData.bankName}
                  onChange={handleInputChange}
                  onKeyPress={handleBankNameInput}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#3b3b3b] focus:border-[#3b3b3b] outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Number
                </label>
                <input
                  type="text"
                  name="accountNumber"
                  placeholder="e.g. 1234567890"
                  value={formData.accountNumber}
                  onChange={handleInputChange}
                  maxLength={18}
                  onKeyPress={handleAccountNumberInput}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#3b3b3b] focus:border-[#3b3b3b] outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Account Holder Name
                </label>
                <input
                  type="text"
                  name="accountHolderName"
                  placeholder="e.g. Jayanth"
                  value={formData.accountHolderName}
                  onChange={handleInputChange}
                  maxLength={100}
                  onKeyPress={handleAccountHolderNameInput}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#3b3b3b] focus:border-[#3b3b3b] outline-none transition"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IFSC Code
                </label>
                <input
                  type="text"
                  name="ifscCode"
                  placeholder="e.g. SBIN0001234"
                  value={formData.ifscCode}
                  onChange={handleInputChange}
                  maxLength={11}
                  onKeyPress={handleIfscCodeInput}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-1 focus:ring-[#3b3b3b] focus:border-[#3b3b3b] outline-none transition"
                />
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-500 text-sm mb-4"
              >
                {error}
              </motion.p>
            )}

            <div className="flex justify-end gap-3">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={resetForm}
                className="flex items-center gap-2 bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded-lg shadow transition-colors"
              >
                <FaTimes /> Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="button"
                onClick={isEditing ? handleUpdateBankDetails : handleAddBankDetails}
                className="flex items-center gap-2 bg-[#3b3b3b] hover:bg-[#3b3b3b] text-white px-4 py-2 rounded-lg shadow transition-colors"
              >
                <FaCheck /> {isEditing ? "Update Bank" : "Save Bank"}
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Bank Cards Grid */}
      {bankDetails.length === 0 ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-12 bg-white rounded-xl shadow-sm border border-gray-200"
        >
          <h3 className="text-xl font-medium text-gray-700 mb-2">
            No Bank Accounts Found
          </h3>
          <p className="text-gray-500 mb-6">
            You haven't added any bank accounts yet.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-[#3b3b3b] hover:bg-[#3b3b3b] text-white px-4 py-2 rounded-lg shadow-md transition-colors"
          >
            <FaPlus /> Add Your First Bank Account
          </motion.button>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {bankDetails.map((detail, index) => (
              <motion.div
                key={detail._id}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
                      <span className="text-blue-600 font-bold text-lg">
                        {detail.bankName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                 
                  </div>

                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    {detail.bankName}
                  </h3>

                  <div className="space-y-3 mt-4">
                    <div>
                      <p className="text-sm text-gray-500">Account Number</p>
                      <p className="font-medium">{detail.accountNumber}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">Account Holder</p>
                      <p className="font-medium">{detail.accountHolderName}</p>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500">IFSC Code</p>
                      <p className="font-medium">{detail.ifscCode}</p>
                    </div>
                  </div>
                  <div className="flex gap-5 justify-end">
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => handleEditBankDetails(detail)}
    className="p-2 bg-gray-200 text-black rounded-full hover:bg-gray-300 transition-colors"
    aria-label="Edit bank account"
  >
    <MdEditDocument className="w-5 h-5" />
  </motion.button>
  <motion.button
    whileHover={{ scale: 1.1 }}
    whileTap={{ scale: 0.9 }}
    onClick={() => handleDeleteBankDetails(detail._id, index)}
    className="p-2 bg-red-100 text-red-500 rounded-full hover:bg-red-200 transition-colors"
    aria-label="Delete bank account"
  >
    <RiDeleteBin6Line className="w-5 h-5" />
  </motion.button>
</div>

                </div>
                
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default BankDetails;