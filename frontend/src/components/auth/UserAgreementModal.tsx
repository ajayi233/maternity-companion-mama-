import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

interface UserAgreementModalProps {
  trigger?: React.ReactNode;
}

export const UserAgreementModal = ({ trigger }: UserAgreementModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {trigger || (
          <button className="text-sm text-pink-600 hover:text-pink-700 underline font-medium">
            User Agreement
          </button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-gray-900">
            MAMA User Agreement
          </DialogTitle>
          <DialogDescription>
            Please read our terms and conditions carefully
          </DialogDescription>
        </DialogHeader>
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-6 text-sm text-gray-700">
            <section>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                1. Acceptance of Terms
              </h3>
              <p className="leading-relaxed">
                By accessing and using MAMA (Maternal AI Medical Assistant), you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                2. Service Description
              </h3>
              <p className="leading-relaxed mb-2">
                MAMA provides:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>AI-powered maternal health information and support</li>
                <li>Appointment and medication reminders</li>
                <li>Educational resources about pregnancy and maternal health</li>
                <li>Clinic locator services</li>
                <li>Emergency contact features</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                3. Medical Disclaimer
              </h3>
              <p className="leading-relaxed mb-2">
                <strong className="text-pink-600">IMPORTANT:</strong> MAMA is not a substitute for professional medical advice, diagnosis, or treatment. Always seek the advice of your physician or other qualified health provider with any questions you may have regarding a medical condition. Never disregard professional medical advice or delay in seeking it because of something you have read or received through MAMA.
              </p>
              <p className="leading-relaxed">
                In case of a medical emergency, immediately call your local emergency services or visit the nearest emergency room.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                4. Privacy and Data Protection
              </h3>
              <p className="leading-relaxed mb-2">
                We are committed to protecting your privacy. Your personal health information will be:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Stored securely and encrypted</li>
                <li>Used only to provide and improve our services</li>
                <li>Never shared with third parties without your explicit consent</li>
                <li>Protected in accordance with applicable data protection laws</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                5. User Responsibilities
              </h3>
              <p className="leading-relaxed mb-2">
                As a user, you agree to:
              </p>
              <ul className="list-disc pl-6 space-y-1">
                <li>Provide accurate and complete information</li>
                <li>Keep your account credentials secure</li>
                <li>Use the service responsibly and lawfully</li>
                <li>Not misuse or attempt to manipulate the AI system</li>
                <li>Attend all scheduled medical appointments</li>
              </ul>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                6. Limitation of Liability
              </h3>
              <p className="leading-relaxed">
                MAMA and its operators shall not be liable for any indirect, incidental, special, consequential, or punitive damages resulting from your use or inability to use the service. This includes any errors or omissions in any content or any loss or damage incurred as a result of the use of any content posted, transmitted, or otherwise made available through the service.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                7. Service Availability
              </h3>
              <p className="leading-relaxed">
                While we strive to provide uninterrupted service, we do not guarantee that the service will be available at all times. We may suspend, withdraw, or restrict the availability of all or any part of our service for business and operational reasons.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                8. Changes to Terms
              </h3>
              <p className="leading-relaxed">
                We reserve the right to modify these terms at any time. We will notify users of any material changes. Your continued use of MAMA after such modifications constitutes your acceptance of the updated terms.
              </p>
            </section>

            <section>
              <h3 className="font-semibold text-lg text-gray-900 mb-2">
                9. Contact Information
              </h3>
              <p className="leading-relaxed">
                If you have any questions about this User Agreement, please contact us through the app's support channels or at support@mama-app.com
              </p>
            </section>

            <section className="border-t pt-4 mt-6">
              <p className="text-xs text-gray-500 italic">
                Last updated: October 2025
              </p>
            </section>
          </div>
        </ScrollArea>
        <div className="flex justify-end pt-4 border-t">
          <DialogTrigger asChild>
            <Button variant="gradient" className="px-6">
              I Understand
            </Button>
          </DialogTrigger>
        </div>
      </DialogContent>
    </Dialog>
  );
};
