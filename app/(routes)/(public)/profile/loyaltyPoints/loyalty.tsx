"use client"
import React, { useCallback, useEffect, useState } from "react";
import { Trophy, Clock, RotateCcw, Banknote, Check, X } from "lucide-react";
import {
  getBankDetails,
  getLoyaltyPoint,
  redeemLoyaltyPoints,
  saveBankDetails,
  transferToBank,
} from "@/app/services/data.service";

import { toast } from "sonner";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { format } from "date-fns";
import { BankDetail } from "../bank/BankDetails";

interface OrderItemResponse {
  orderItemId: string;
  productId: string;
  productName: string;
  productDescription: string;
  productImage: string;
  quantity: number;
  unitPrice: number;
  productColor: string;
  productSize: string;
  totalAmount: number;
  productOfferPercentage: number;
  returnDaysPolicy: number;
  deliveryStatus: string;
  deliveryDate: string | null;
  cancelOrderDate: string | null;
  paymentMethod: string;
  paymentStatus: string;
}

interface FabricDetails {
  fabricId: string;
  imageUrl: string[];
  fabricColor: string;
  fabricPrice: number;
  fabricColorCode: string;
  fabricDescription: string;
  productOfferPercentage: number;
}

interface CustomizedAddDataResponse {
  pantType: string;
  trueWaistMeasurement: number;
  pantInSeamLength: number;
  pantOutSeamLength: number;
  fitType: string;
  riseType: string;
  frontPocketType: string;
  backPocketType: string;
  frontButtonType: string;
  backButtonType: string;
  pantPleatType: string;
  flyType: string;
  pantCuffsType: string;
  fabric: FabricDetails;
}

interface CustomizedCartItemResponse {
  orderItemId: string;
  quantity: number;
  price: number;
  totalAmount: number;
  productSize: string;
  returnDaysPolicy: number;
  productName: string;
  productDescription: string;
  productOfferPercentage: number;
  productImageUrl: string;
  productColor: string;
  deliveryStatus: string;
  deliveryDate: string;
  cancelOrderDate: string | null;
  paymentMethod: string;
  paymentStatus: string;
  customizedAddDataResponse: CustomizedAddDataResponse;
}

interface Transaction {
  loyaltyTransactionId: string;
  pointsChange: number;
  transactionType: string;
  loyaltyTransactionStatus: string;
  description: string;
  orderItemId: string;
  transactionDate: string;
  orderItemResponse: OrderItemResponse | null;
  customizedCartItemResponse: CustomizedCartItemResponse | null;
}

export interface LoyaltyPointsData {
  loyaltyId: string;
  totalLoyaltyPoints: number;
  totalExpiredPoints: number;
  totalRedeemedPoints: number;
  lastUpdated: string;
  loyaltyPointsTransactionResponses: Transaction[];
}

const LoyaltyPoints: React.FC = () => {
  const [loyaltyData, setLoyaltyData] = useState<LoyaltyPointsData | null>(null);
//   const { showLoader, hideLoader } = useLoader();
  const [bankDetails, setBankDetails] = useState<BankDetail[]>([]);
  const [selectedBankId, setSelectedBankId] = useState<string | null>(null);
  const [redeemPoints, setRedeemPoints] = useState("");
  const [showRedeemDialog, setShowRedeemDialog] = useState(false);
  const [showBankSelection, setShowBankSelection] = useState(false);
  const [showAddBankDialog, setShowAddBankDialog] = useState(false);
  const [bankForm, setBankForm] = useState({
    bankName: "",
    accountNumber: "",
    accountHolderName: "",
    bankIfscCode: "",
  });

  const fetchLoyaltyPoints = async () => {
    try {
      const data = await getLoyaltyPoint();
      setLoyaltyData(data);
    } catch (error) {
      console.error("Error fetching loyalty points:", error);
      toast.error("Failed to load loyalty points data");
    }
  };

  const fetchBankDetails = useCallback(async () => {
    try {
      const response = await getBankDetails();
      if (response && Array.isArray(response)) {
        setBankDetails(response);
      } else {
        toast.error("Failed to load bank details.");
      }
    } catch (error) {
      toast.error("Error fetching bank details. Please try again.");
    }
  }, []);
  

  useEffect(() => {
    fetchLoyaltyPoints();
    fetchBankDetails();
  }, [fetchBankDetails]);

  const handleRedeemClick = () => {
    if (bankDetails.length === 0) {
      setShowAddBankDialog(true);
    } else {
      setShowRedeemDialog(true);
    }
    setRedeemPoints("");
    setShowBankSelection(false);
    setSelectedBankId(null);
  };

  const handleAddBankSubmit = async () => {
    const { bankName, accountNumber, accountHolderName, bankIfscCode } = bankForm;
    if (!bankName || !accountNumber || !accountHolderName || !bankIfscCode) {
      toast.error("Please fill all fields!");
      return;
    }

    // const formData = {
    //   bankName,
    //   accountNumber,
    //   accountHolderName,
    //   bankIfscCode,
    //   userBankId: `bank-${Date.now()}`,
    // };

    // try {
    //   const response = await saveBankDetails(formData);
    //   if (response) {
    //     await fetchBankDetails();
    //     setBankForm({
    //       bankName: "",
    //       accountNumber: "",
    //       accountHolderName: "",
    //       bankIfscCode: "",
    //     });
    //     setShowAddBankDialog(false);
    //     toast.success("Bank details added successfully!");
    //   } else {
    //     toast.error("Failed to save bank details.");
    //   }
    // } catch (error) {
    //   toast.error("Error saving bank details. Please try again.");
    // }
  };

  const handleCheckAvailability = async () => {
    if (!redeemPoints || Number(redeemPoints) <= 0) {
      toast.error("Please enter a valid number of loyalty points.");
      return;
    }

    if (Number(redeemPoints) > (loyaltyData?.totalLoyaltyPoints || 0)) {
      toast.error("You don't have enough loyalty points.");
      return;
    }

    try {
      const response = await redeemLoyaltyPoints(Number(redeemPoints));
      if (response) {
        setShowBankSelection(true);
      } else {
        toast.error("Not enough loyalty points.");
      }
    } catch (error) {
      console.error("Error checking availability:", error);
      toast.error("Error processing redemption request");
    }
  };

  const handleConfirmSelection = async () => {
    if (!selectedBankId) {
      toast.error("Please select a bank before confirming.");
      return;
    }

    const transferDetails = {
      userBankId: selectedBankId,
      amount: loyaltyData?.totalLoyaltyPoints as number,
    };

    try {
      const response = await transferToBank(transferDetails);
      if (response) {
        toast.success("Transfer to account request has been initiated!");
        fetchLoyaltyPoints();
        setShowRedeemDialog(false);
      } else {
        toast.error("Transfer failed. Please try again.");
      }
    } catch (error) {
      toast.error("Error processing transfer.");
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status.toLowerCase()) {
      case "completed":
        return <Badge variant="default">{status}</Badge>;  // Instead of "success"
      case "pending":
        return <Badge variant="secondary">{status}</Badge>; // Instead of "warning"
      case "failed":
        return <Badge variant="destructive">{status}</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };
  

  if (!loyaltyData) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* Total Points Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Total Points
            </CardTitle>
            <div className="bg-green-100 p-3 rounded-full">
              <Trophy className="h-6 w-6 text-green-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loyaltyData.totalLoyaltyPoints}
            </div>
            <Button
              onClick={handleRedeemClick}
              disabled={loyaltyData.totalLoyaltyPoints <= 0}
              className="mt-4 w-full"
              variant={loyaltyData.totalLoyaltyPoints <= 0 ? "outline" : "default"}
            >
              Redeem Points
            </Button>
          </CardContent>
        </Card>

        {/* Expired Points Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Expired Points
            </CardTitle>
            <div className="bg-red-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-red-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loyaltyData.totalExpiredPoints}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Points that have expired
            </p>
          </CardContent>
        </Card>

        {/* Redeemed Points Card */}
        <Card className="hover:shadow-lg transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-500">
              Redeemed Points
            </CardTitle>
            <div className="bg-amber-100 p-3 rounded-full">
              <RotateCcw className="h-6 w-6 text-amber-600" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {loyaltyData.totalRedeemedPoints}
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Points you've redeemed
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Transactions Section */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-4">Transaction History</h2>
        <div className="grid grid-cols-1 gap-4">
          {loyaltyData.loyaltyPointsTransactionResponses.map((transaction) => (
            <Card key={transaction.loyaltyTransactionId} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-center">
                  <CardTitle className="text-lg">
                    {transaction.transactionType}
                  </CardTitle>
                  {getStatusBadge(transaction.loyaltyTransactionStatus)}
                </div>
                <CardDescription>
                  {format(new Date(transaction.transactionDate), "PPpp")}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-2">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium">Points</p>
                    <p className={transaction.pointsChange > 0 ? "text-green-600" : "text-red-600"}>
                      {transaction.pointsChange > 0 ? "+" : ""}{transaction.pointsChange}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Description</p>
                    <p className="text-sm">{transaction.description}</p>
                  </div>
                </div>

                {transaction.orderItemResponse && (
                  <>
                    <Separator className="my-3" />
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium">Product</p>
                        <p className="text-sm">{transaction.orderItemResponse.productName}</p>
                      </div>
                      <div>
                        <p className="text-sm font-medium">Quantity</p>
                        <p className="text-sm">{transaction.orderItemResponse.quantity}</p>
                      </div>
                    </div>
                  </>
                )}

                {transaction.customizedCartItemResponse && (
                  <>
                    <Separator className="my-3" />
                    <div>
                      <p className="text-sm font-medium">Custom Product</p>
                      <p className="text-sm">{transaction.customizedCartItemResponse.productName}</p>
                    </div>
                  </>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Redeem Points Dialog */}
      <Dialog open={showRedeemDialog} onOpenChange={setShowRedeemDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Redeem Loyalty Points</DialogTitle>
            <DialogDescription>
              Convert your loyalty points to cash in your bank account
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="points" className="text-right">
                Points
              </Label>
              <Input
                id="points"
                type="number"
                value={redeemPoints}
                onChange={(e) => setRedeemPoints(e.target.value)}
                className="col-span-3"
                placeholder="Enter points to redeem"
              />
            </div>
            {showBankSelection && (
              <div className="space-y-4">
                <Separator />
                <h4 className="font-medium">Select Bank Account</h4>
                <RadioGroup
                  value={selectedBankId || ""}
                  onValueChange={setSelectedBankId}
                  className="space-y-2"
                >
                  {/* {bankDetails.map((bank) => (
                    <div key={bank.userBankId} className="flex items-center space-x-2">
                      <RadioGroupItem value={bank.userBankId} id={bank.userBankId} />
                      <Label htmlFor={bank.userBankId} className="flex flex-col">
                        <span className="font-medium">{bank.bankName}</span>
                        <span className="text-sm text-gray-500">
                          {bank.accountNumber} • {bank.accountHolderName}
                        </span>
                      </Label>
                    </div>
                  ))} */}
                </RadioGroup>
              </div>
            )}
          </div>
          <DialogFooter>
            {!showBankSelection ? (
              <Button onClick={handleCheckAvailability} type="button">
                Check Availability
              </Button>
            ) : (
              <div className="flex gap-2">
                <Button variant="outline" onClick={() => setShowBankSelection(false)}>
                  Back
                </Button>
                <Button onClick={handleConfirmSelection} type="button">
                  Confirm Transfer
                </Button>
              </div>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Add Bank Dialog */}
      <Dialog open={showAddBankDialog} onOpenChange={setShowAddBankDialog}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Add Bank Details</DialogTitle>
            <DialogDescription>
              Add your bank account to redeem loyalty points
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="bankName" className="text-right">
                Bank Name
              </Label>
              <Input
                id="bankName"
                value={bankForm.bankName}
                onChange={(e) => setBankForm({...bankForm, bankName: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountNumber" className="text-right">
                Account Number
              </Label>
              <Input
                id="accountNumber"
                value={bankForm.accountNumber}
                onChange={(e) => setBankForm({...bankForm, accountNumber: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="accountHolderName" className="text-right">
                Account Holder
              </Label>
              <Input
                id="accountHolderName"
                value={bankForm.accountHolderName}
                onChange={(e) => setBankForm({...bankForm, accountHolderName: e.target.value})}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="ifsc" className="text-right">
                IFSC Code
              </Label>
              <Input
                id="ifsc"
                value={bankForm.bankIfscCode}
                onChange={(e) => setBankForm({...bankForm, bankIfscCode: e.target.value})}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button onClick={handleAddBankSubmit} type="button">
              Save Bank Details
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default LoyaltyPoints;