import { useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useUserBalance } from "@/hooks/useUserBalance";

const CorporateForm = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { balance } = useUserBalance();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    companyName: "",
    companyType: "",
    registrationNumber: "",
    panNumber: "",
    holderName: "",
    contactPhone: "",
    contactEmail: "",
    bankName: "",
    aadharPhoto: null as File | null,
    panPhoto: null as File | null,
  });

  const indianBanks = [
    "State Bank of India (SBI)",
    "HDFC Bank",
    "ICICI Bank",
    "Axis Bank",
    "J&K Bank",
    "Karnataka Bank (KBL)",
    "RBL Bank",
    "Suryodya Small finance",
    "Kerala Gramin Bank",
    "Kotak Mahindra Bank",
    "Au small fin. Bank",
    "Federal Bank",
    "Punjab National Bank (PNB)",
    "Bank of Baroda",
    "Canara Bank",
    "Union Bank of India",
    "Indian Bank",
    "Central Bank of India",
    "IDBI Bank",
    "UCO Bank",
    "Bank of Maharashtra",
    "Indian Overseas Bank",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast.error("Please login to submit your corporate account details");
      return;
    }

    if (!formData.companyName || !formData.companyType || !formData.registrationNumber || !formData.panNumber || !formData.holderName || !formData.contactPhone || !formData.contactEmail) {
      toast.error("Please fill all required fields");
      return;
    }

    if (balance.usdt_balance < 1500) {
      toast.error("Minimum 1500 USD recharge required to upload corporate account");
      return;
    }

    setLoading(true);
    
    try {
      let documentsUploaded = false;

      // Upload Aadhar photo if provided
      if (formData.aadharPhoto) {
        const aadharFileName = `${user.id}/aadhar_${Date.now()}.${formData.aadharPhoto.name.split('.').pop()}`;
        const { error: aadharError } = await supabase.storage
          .from('corporate-docs')
          .upload(aadharFileName, formData.aadharPhoto);

        if (aadharError) throw aadharError;
        documentsUploaded = true;
      }

      // Upload PAN photo if provided
      if (formData.panPhoto) {
        const panFileName = `${user.id}/pan_${Date.now()}.${formData.panPhoto.name.split('.').pop()}`;
        const { error: panError } = await supabase.storage
          .from('corporate-docs')
          .upload(panFileName, formData.panPhoto);

        if (panError) throw panError;
        documentsUploaded = true;
      }

      const { data, error } = await supabase
        .from('corporate_accounts')
        .insert({
          user_id: user.id,
          company_name: formData.companyName,
          company_type: formData.companyType,
          registration_number: formData.registrationNumber,
          pan_number: formData.panNumber,
          contact_person: formData.holderName,
          contact_phone: formData.contactPhone,
          contact_email: formData.contactEmail,
          documents_uploaded: documentsUploaded,
          status: 'pending'
        });

      if (error) throw error;

      toast.success("Corporate account application submitted successfully!");
      navigate("/");
    } catch (error) {
      console.error('Error submitting account:', error);
      toast.error("Failed to submit account application. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = (field: string, file: File | null) => {
    setFormData(prev => ({ ...prev, [field]: file }));
  };

  return (
    <div className="min-h-screen bg-background max-w-md mx-auto">
      <header className="bg-white border-b border-border sticky top-0 z-40">
        <div className="flex items-center h-14 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/corporate-account")}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-semibold text-foreground">Corporate Account Form</h1>
        </div>
      </header>
      
      <main className="px-4 py-6 animate-slide-up pb-20">
        <Card className="p-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="companyName">Company Name</Label>
              <Input
                id="companyName"
                value={formData.companyName}
                onChange={(e) => setFormData(prev => ({ ...prev, companyName: e.target.value }))}
                placeholder="Enter company name"
                required
              />
            </div>

            <div>
              <Label htmlFor="bankName">Bank Name</Label>
              <Select value={formData.bankName} onValueChange={(value) => setFormData(prev => ({ ...prev, bankName: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select bank (optional)" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50 max-h-60">
                  {indianBanks.map((bank) => (
                    <SelectItem key={bank} value={bank}>{bank}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="companyType">Company Type</Label>
              <Select value={formData.companyType} onValueChange={(value) => setFormData(prev => ({ ...prev, companyType: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select company type" />
                </SelectTrigger>
                <SelectContent className="bg-white border shadow-lg z-50">
                  <SelectItem value="Private Limited">Private Limited</SelectItem>
                  <SelectItem value="Public Limited">Public Limited</SelectItem>
                  <SelectItem value="Partnership">Partnership</SelectItem>
                  <SelectItem value="Sole Proprietorship">Sole Proprietorship</SelectItem>
                  <SelectItem value="LLP">Limited Liability Partnership (LLP)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="registrationNumber">Registration Number</Label>
              <Input
                id="registrationNumber"
                value={formData.registrationNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, registrationNumber: e.target.value }))}
                placeholder="Enter registration number"
                required
              />
            </div>

            <div>
              <Label htmlFor="panNumber">PAN Number</Label>
              <Input
                id="panNumber"
                value={formData.panNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, panNumber: e.target.value }))}
                placeholder="Enter PAN number"
                required
              />
            </div>

            <div>
              <Label htmlFor="holderName">Holder Name</Label>
              <Input
                id="holderName"
                value={formData.holderName}
                onChange={(e) => setFormData(prev => ({ ...prev, holderName: e.target.value }))}
                placeholder="Enter holder name"
                required
              />
            </div>

            <div>
              <Label htmlFor="contactPhone">Contact Phone</Label>
              <Input
                id="contactPhone"
                value={formData.contactPhone}
                onChange={(e) => setFormData(prev => ({ ...prev, contactPhone: e.target.value }))}
                placeholder="Enter contact phone number"
                required
              />
            </div>

            <div>
              <Label htmlFor="contactEmail">Contact Email</Label>
              <Input
                id="contactEmail"
                type="email"
                value={formData.contactEmail}
                onChange={(e) => setFormData(prev => ({ ...prev, contactEmail: e.target.value }))}
                placeholder="Enter contact email"
                required
              />
            </div>

            

            <div>
              <Label>Aadhar Photo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('aadharPhoto', e.target.files?.[0] || null)}
                  className="hidden"
                  id="aadhar"
                />
                <label htmlFor="aadhar" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {formData.aadharPhoto ? formData.aadharPhoto.name : "Click to upload Aadhar photo"}
                  </p>
                </label>
              </div>
            </div>

            <div>
              <Label>PAN Photo</Label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => handleFileUpload('panPhoto', e.target.files?.[0] || null)}
                  className="hidden"
                  id="pan"
                />
                <label htmlFor="pan" className="cursor-pointer">
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600">
                    {formData.panPhoto ? formData.panPhoto.name : "Click to upload PAN photo"}
                  </p>
                </label>
              </div>
            </div>

            <Button type="submit" className="w-full mt-6 bg-green-500 hover:bg-green-600 text-white">
              Submit Corporate Account Application
            </Button>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default CorporateForm;
