import { useEffect, useState } from "react";
import { Copy, Users, Share2, MessageCircle, Facebook, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import Header from "@/components/Header";
import BottomNavigation from "@/components/BottomNavigation";
import CautionBanner from "@/components/CautionBanner";
import { toast } from "sonner";
import { useTeamStats } from "@/hooks/useTeamStats";
import { supabase } from "@/integrations/supabase/client";

const Team = () => {
  const { teamStats, loading } = useTeamStats();
  const [members, setMembers] = useState<Array<{ name: string, member_user_id: string | null }>>([]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const { data } = await supabase
          .from('teams')
          .select('name, member_user_id')
          .eq('owner_user_id', (window as any).supabase?.auth?.user?.()?.id || undefined);

        if (data) setMembers(data as any);
      } catch (e) {
        console.warn('Failed to fetch team members', e);
      }
    };

    fetchMembers();
  }, []);
  const [inviteLink] = useState("https://nrxpay.vercel.app/");
  const [copied, setCopied] = useState(false);
  
  const shareMessage = `Join me on NRXPay and exchange usdt at highest rate in whole market! 🚀\n\nSign up using my link: ${inviteLink}`;

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
    setCopied(true);
    toast.success("Invite link copied!");
    setTimeout(() => setCopied(false), 2000);
  };

  const shareOptions = [
    { 
      icon: Send, 
      label: "Telegram", 
      color: "text-blue-500", 
      action: () => {
        window.open(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=${encodeURIComponent(shareMessage)}`, '_blank');
      }
    },
    { 
      icon: Facebook, 
      label: "Facebook", 
      color: "text-blue-600", 
      action: () => {
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(inviteLink)}&quote=${encodeURIComponent(shareMessage)}`, '_blank');
      }
    },
    { 
      icon: MessageCircle, 
      label: "WhatsApp", 
      color: "text-green-500", 
      action: () => {
        window.open(`https://wa.me/?text=${encodeURIComponent(shareMessage)}`, '_blank');
      }
    },
    { 
      icon: Share2, 
      label: "More", 
      color: "text-gray-600", 
      action: async () => {
        if (navigator.share) {
          try {
            await navigator.share({
              title: 'Join NRXPay',
              text: shareMessage,
              url: inviteLink
            });
          } catch (error) {
            console.log('Share cancelled');
          }
        } else {
          copyInviteLink();
        }
      }
    },
  ];

  return (
    <div className="min-h-screen bg-background pb-20 max-w-md mx-auto">
      <Header />
      
      <main className="px-4 py-6 space-y-6 animate-slide-up">
        <div className="text-center space-y-2">
          <Users className="w-12 h-12 mx-auto text-green-600" />
          <h2 className="text-2xl font-bold text-foreground">Team Rewards</h2>
          <p className="text-sm text-muted-foreground">Invite friends and earn together</p>
        </div>

        {/* Earning Benefits */}
        <Card className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm">
                <span className="font-bold text-green-700">4%</span> of invited subline's rebate is yours
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <p className="text-sm">
                <span className="font-bold text-green-700">4%</span> of invited subline's withdrawal rebate is yours
              </p>
            </div>
          </div>
        </Card>

        {/* Invite Link */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Invite Link</h3>
          <div className="flex space-x-2">
            <Input 
              value={inviteLink} 
              readOnly 
              className="text-sm bg-gray-50"
            />
            <Button
              onClick={copyInviteLink}
              variant={copied ? "secondary" : "default"}
              size="sm"
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        </Card>

        {/* More Ways to Invite */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">More ways to invite</h3>
          <div className="grid grid-cols-2 gap-3">
            {shareOptions.map((option, index) => (
              <Button
                key={index}
                variant="outline"
                onClick={option.action}
                className="flex items-center justify-center space-x-2 h-12"
              >
                <option.icon className={`h-5 w-5 ${option.color}`} />
                <span className="text-sm">{option.label}</span>
              </Button>
            ))}
          </div>
        </Card>

        {/* Team Stats */}
        <Card className="p-4">
          <h3 className="font-semibold mb-3">Your Team Stats</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {loading ? "..." : teamStats.team_members}
              </p>
              <p className="text-xs text-muted-foreground">Team Members</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                ₹{loading ? "..." : teamStats.total_earned.toLocaleString()}
              </p>
              <p className="text-xs text-muted-foreground">Total Earned</p>
            </div>
          </div>
          {members.length > 0 && (
            <div className="mt-4">
              <h4 className="text-sm font-medium mb-2">Team Members</h4>
              <ul className="list-disc list-inside text-sm text-muted-foreground">
                {members.map((m, idx) => (
                  <li key={idx}>{m.name}</li>
                ))}
              </ul>
            </div>
          )}
        </Card>
      </main>

      <BottomNavigation />
    </div>
  );
};

export default Team;
