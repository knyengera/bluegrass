
import React from "react";
import { Button } from "@/components/ui/button";
import Logo from "../components/common/Logo";
import { ArrowRight, Download, Smartphone } from "lucide-react";

const ClientRedirect = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background to-muted p-4">
      <div className="max-w-md w-full text-center space-y-8">
        <div>
          <Logo size="large" />
          <h2 className="mt-6 text-3xl font-extrabold">Client Access</h2>
          <p className="mt-2 text-muted-foreground">
            This dashboard is for administrators only
          </p>
        </div>

        <div className="bg-card p-8 rounded-lg shadow-lg">
          <div className="flex justify-center mb-6">
            <Smartphone size={64} className="text-primary" />
          </div>
          
          <h3 className="text-xl font-bold mb-4">Download the Mobile App</h3>
          <p className="mb-6 text-muted-foreground">
            To access Pantry by Marble services, please download our mobile app from your device's app store.
          </p>
          
          <div className="space-y-3">
            <Button className="w-full">
              <Download size={16} className="mr-2" /> App Store
            </Button>
            <Button className="w-full">
              <Download size={16} className="mr-2" /> Google Play
            </Button>
            <Button variant="outline" className="w-full" onClick={() => window.location.href = "/"}>
              Back to Login <ArrowRight size={16} className="ml-2" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientRedirect;
