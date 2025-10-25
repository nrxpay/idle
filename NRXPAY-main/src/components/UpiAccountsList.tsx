
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

const UpiAccountsList = () => {
  const [upiAccounts, setUpiAccounts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const fetchUpiAccounts = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data, error } = await supabase
          .from("user_upis")
          .select("*")
          .eq("user_id", user.id);

        if (error) {
          console.error("Error fetching UPI accounts:", error);
        } else {
          setUpiAccounts(data || []);
        }
      }
      setLoading(false);
    };

    fetchUpiAccounts();
  }, []);

  if (loading) {
    return <p className="text-sm text-muted-foreground">Loading UPI accounts...</p>;
  }

  const visible = expanded ? upiAccounts : upiAccounts.slice(0, 2);

  return (
    <div>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium text-muted-foreground">UPI Accounts</h3>
        {upiAccounts.length > 2 && (
          <button
            className="text-xs text-primary underline"
            onClick={() => setExpanded((s) => !s)}
          >
            {expanded ? "Show less" : `Show all (${upiAccounts.length})`}
          </button>
        )}
      </div>

      {upiAccounts.length > 0 ? (
        <div className="space-y-2">
          {visible.map((account) => (
            <div key={String(account.id ?? account.upi_id ?? Math.random())} className="bg-muted/50 p-2 rounded-lg flex items-center justify-between">
              <div>
                <p className="font-medium text-foreground text-sm">{account.name}</p>
                <p className="text-xs text-muted-foreground">{account.upi_id}</p>
              </div>
              <p className="text-xs text-muted-foreground">{maskMobile(account.mobile_number)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-muted-foreground">No UPI account added yet</p>
      )}
    </div>
  );
};

export default UpiAccountsList;

function maskUpi(upi?: string) {
  if (!upi) return "";
  const atIndex = upi.indexOf("@");
  if (atIndex > 0) {
    const local = upi.slice(0, atIndex);
    const domain = upi.slice(atIndex);
    const shown = local.slice(0, 3);
    return `${shown}${local.length > 3 ? '***' : '*'}${domain}`;
  }
  // no domain - just show first 3 and mask rest
  if (upi.length <= 4) return upi.replace(/.(?=.{2})/g, "*");
  return `${upi.slice(0,3)}***${upi.slice(-2)}`;
}

function maskMobile(mobile?: string) {
  if (!mobile) return "";
  const digits = mobile.replace(/\D/g, "");
  if (digits.length <= 3) return mobile.replace(/.(?=.{1})/g, "*");
  // show last 3 digits only
  return "***" + digits.slice(-3);
}
