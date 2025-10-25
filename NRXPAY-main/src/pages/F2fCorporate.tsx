
import { ArrowLeft, CheckCircle, Gem, Crown, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog } from "@/components/ui/dialog";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

const F2fCorporate = () => {
  const navigate = useNavigate();
  const [showLocationsPopup, setShowLocationsPopup] = useState(false);

  return (
    <div
      className="min-h-screen bg-white text-black max-w-md mx-auto"
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"',
      }}
    >
      <header className="bg-white border-b border-gray-300 sticky top-0 z-40">
        <div className="flex items-center h-16 px-4">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="mr-2 text-black hover:bg-gray-200"
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <h1 className="text-xl font-bold tracking-tight text-black">NRX SPECIAL CORPORATE RUN</h1>
        </div>
      </header>

      <main className="px-4 py-8 space-y-8 pb-24">
        <div className="text-center space-y-3">
           <p className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600">
             NRX PAY: INDIA'S #1 GAMING COMPANY
           </p>
           <Button
             onClick={() => setShowLocationsPopup(true)}
             className="bg-gradient-to-r from-yellow-500 to-red-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-2 px-4 rounded"
           >
             Check available locations
           </Button>
           <p className="text-md text-gray-500 italic">
             Run your corporate account f2f with us and make it a source of
             income.
           </p>
         </div>

        <div className="text-center mb-4">
          <Button
            onClick={() => window.location.href = "https://t.me/nrxsupport"}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded h-12 text-lg"
          >
            Upload corporate now
          </Button>
        </div>

        <Card className="bg-gray-50/50 border-gray-300 p-6 space-y-4 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-lg font-bold flex items-center text-black bg-gray-200 px-3 py-2 rounded-md">
            <Gem className="mr-2 h-5 w-5" />
            GAME PAYIN (MQR MUST)
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center">
              <span className="mr-3 text-purple-400 font-semibold">1.</span>
              SBI CMP
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-purple-400 font-semibold">2.</span>
              SBI 3ID
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-purple-400 font-semibold">3.</span>
              KTB
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-purple-400 font-semibold">4.</span>
              J&K
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-purple-400 font-semibold">5.</span>
              RBL
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-purple-400 font-semibold">6.</span>
              DBS
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-purple-400 font-semibold">7.</span>
              TMB
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-purple-400 font-semibold">8.</span>
              DHANLAXMI
            </li>
            <li className="flex items-center">
              <span className="mr-3 text-purple-400 font-semibold">9.</span>
              KGB
            </li>
          </ul>
        </Card>

        <Card className="bg-gray-50/50 border-gray-300 p-6 space-y-4 transform hover:scale-105 transition-transform duration-300">
          <h3 className="text-lg font-bold text-black bg-gray-200 px-3 py-2 rounded-md">STOCK FUND</h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-green-400 font-semibold">1.</span>
              DBS corporate
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-green-400 font-semibold">2.</span>
              Ujjivan corporate
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-green-400 font-semibold">3.</span>
              Federal Ebiz
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-green-400 font-semibold">4.</span>
              Bandhan
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-green-400 font-semibold">5.</span>
              Au corporate
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-green-400 font-semibold">6.</span>
              Hsbc corporate
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-green-400 font-semibold">7.</span>
              Bank of Maharashtra
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-green-400 font-semibold">8.</span>
              Saraswat bank
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-green-400 font-semibold">9.</span>
              BABASSEIN CATHOLIC CO-OP BANK (BCCB)
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-green-400 font-semibold">10.</span>
              UTKARSH SMALL FINANCE BANK
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-green-400 font-semibold">11.</span>
              COSMOS
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-green-400 font-semibold">12.</span>
              CSB
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-green-400 font-semibold">13.</span>
              AXIS NEO CORPORATE
            </li>
          </ul>
        </Card>

        <Card className="bg-gray-50/50 border-gray-300 p-6 space-y-4">
          <h3 className="text-lg font-bold text-black bg-gray-200 px-3 py-2 rounded-md">
            GAME PAYOUT (NO NEED QR)
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-blue-400 font-semibold">1.</span>
              INDUS+BULK MODE
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-blue-400 font-semibold">2.</span>
              AXIS NEO CORPORATE or PAYPRO
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-blue-400 font-semibold">3.</span>
              Bandhan Bank
            </li>
          </ul>
        </Card>

        <Card className="bg-gray-50/50 border-gray-300 p-6 space-y-4">
          <h3 className="text-lg font-bold text-black bg-gray-200 px-3 py-2 rounded-md">
            CORPORATES ACCEPTED BY COMPANY
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-yellow-400 font-semibold">1.</span>
              BOM +MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-yellow-400 font-semibold">2.</span>
              BOM 2ID +MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-yellow-400 font-semibold">3.</span>
              J&K bank +MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-yellow-400 font-semibold">4.</span>
              Suryodyabank +MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-yellow-400 font-semibold">5.</span>
              Karnataka bank +MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-yellow-400 font-semibold">6.</span>
              TJSB bank + MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-yellow-400 font-semibold">7.</span>
              Equitas Business ESFB + MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-yellow-400 font-semibold">8.</span>
              DHANLAXMI BANK DLXB + MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-yellow-400 font-semibold">9.</span>
              SBI bank +cmp +MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-yellow-400 font-semibold">10.</span>
              BOB bank + MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-yellow-400 font-semibold">11.</span>
              CUB bank +MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-yellow-400 font-semibold">12.</span>
              RBLcorporate +MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-yellow-400 font-semibold">13.</span>
              SBI 3ID +MQR
            </li>
          </ul>
        </Card>

        <Card className="bg-gray-50/50 border-gray-300 p-6 space-y-4">
          <h3 className="text-lg font-bold text-black bg-gray-200 px-3 py-2 rounded-md">
            PREMIUM CORPORATES
          </h3>
          <ul className="space-y-3 text-gray-700">
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-pink-400 font-semibold">1.</span>
              SBI CMP corporate+ MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-pink-400 font-semibold">2.</span>
              SBI 3ID corporate+ MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-pink-400 font-semibold">3.</span>
              SBI 4ID corporate+ MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-pink-400 font-semibold">4.</span>
              SBI 5ID corporate+ MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-pink-400 font-semibold">5.</span>
              RBL corporate & retail+ MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-pink-400 font-semibold">6.</span>
              IOB retail+ MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-pink-400 font-semibold">7.</span>
              BOM corporate & retail+ MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-pink-400 font-semibold">7.</span>
              BOM Corporate AppID version+ MQR
            </li>
            <li className="flex items.center">
              <span className="mr-3 text-pink-400 font-semibold">8.</span>
              J&K corporate& retail+ MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-pink-400 font-semibold">9.</span>
              KBL corporate + MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-pink-400 font-semibold">10.</span>
              IDBI personal/corporate + MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-pink-400 font-semibold">11.</span>
              KARNATAKA Bank Login mode:KBL One for corporates+MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-pink-400 font-semibold">12.</span>
              DBS+MQR
            </li>
            <li className="flex items-center font-semibold">
              <span className="mr-3 text-pink-400 font-semibold">13.</span>
              TJSB+MQR
            </li>
          </ul>
        </Card>

      </main>

      {showLocationsPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Available Locations</h3>
              <button
                onClick={() => setShowLocationsPopup(false)}
                className="text-gray-500 hover:text-gray-700 text-xl font-bold"
              >
                ✕
              </button>
            </div>
            <div className="space-y-3">
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-red-500" />
                <span className="text-gray-700">NOIDA</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-red-500" />
                <span className="text-gray-700">GREATER NOIDA</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-red-500" />
                <span className="text-gray-700">DELHI</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-red-500" />
                <span className="text-gray-700">NAGPUR</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-red-500" />
                <span className="text-gray-700">LUCKNOW</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-red-500" />
                <span className="text-gray-700">KOLKATA</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-red-500" />
                <span className="text-gray-700">MUMBAI</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-red-500" />
                <span className="text-gray-700">GAZIABAD</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-red-500" />
                <span className="text-gray-700">GURUGRAM</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-red-500" />
                <span className="text-gray-700">ALIGARH</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-red-500" />
                <span className="text-gray-700">HYDERABAD</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-red-500" />
                <span className="text-gray-700">CHENNAI</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3 text-red-500" />
                <span className="text-gray-700">PATNA</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default F2fCorporate;
