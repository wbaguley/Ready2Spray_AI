import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { trpc } from "@/lib/trpc";
import { toast } from "sonner";
import { CheckCircle2, Plane, FileText, Users, Zap } from "lucide-react";

export default function LandingPage() {
  const [showWaitlist, setShowWaitlist] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    phone: "",
    message: "",
  });

  const joinWaitlistMutation = trpc.waitlist.join.useMutation({
    onSuccess: () => {
      toast.success("Thanks for joining! We'll be in touch soon.");
      setShowWaitlist(false);
      setFormData({ name: "", email: "", company: "", phone: "", message: "" });
    },
    onError: (error) => {
      toast.error(error.message || "Failed to join waitlist. Please try again.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error("Please provide your name and email");
      return;
    }
    joinWaitlistMutation.mutate(formData);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-purple-800 to-indigo-900">
      {/* Navigation */}
      <nav className="border-b border-purple-700/50 bg-purple-900/50 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img src="/ready2spray-logo.png" alt="Ready2Spray" className="h-12 w-12" />
              <span className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
                ready2spray
              </span>
            </div>
            <Button
              onClick={() => setShowWaitlist(true)}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold"
            >
              Join Waitlist
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-8">
            <img
 src="/ready2spray-logo.png" alt="Ready2Spray" className="h-32 w-32 mx-auto" />
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
            Streamline Your Agricultural Spraying Operations
          </h1>
          <p className="text-xl text-purple-200 mb-8 max-w-2xl mx-auto">
            Ready2Spray is the all-in-one platform for managing drone spraying jobs, tracking EPA compliance, 
            and coordinating your agricultural spray operations with AI-powered efficiency.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => setShowWaitlist(true)}
              className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold text-lg px-8"
            >
              Get Early Access
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-purple-400 text-purple-200 hover:bg-purple-800/50"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-20">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-white mb-12">
            Everything You Need to Manage Spray Operations
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-700/50 rounded-lg p-6">
              <div className="bg-gradient-to-br from-purple-500 to-cyan-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Plane className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Job Management</h3>
              <p className="text-purple-200">
                Create, schedule, and track all your spray jobs in one centralized dashboard. Assign personnel, equipment, and locations with ease.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-700/50 rounded-lg p-6">
              <div className="bg-gradient-to-br from-purple-500 to-cyan-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">EPA Compliance</h3>
              <p className="text-purple-200">
                AI-powered product label extraction automatically captures REI, PHI, application rates, and all EPA requirements from product labels.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-700/50 rounded-lg p-6">
              <div className="bg-gradient-to-br from-purple-500 to-cyan-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Team Coordination</h3>
              <p className="text-purple-200">
                Manage customers, personnel, and equipment. Role-based access control ensures everyone sees exactly what they need.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-700/50 rounded-lg p-6">
              <div className="bg-gradient-to-br from-purple-500 to-cyan-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <Zap className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">AI Assistant</h3>
              <p className="text-purple-200">
                Built-in AI chat widget helps you manage jobs, check weather, and answer questions about your operations instantly.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-700/50 rounded-lg p-6">
              <div className="bg-gradient-to-br from-purple-500 to-cyan-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <CheckCircle2 className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Audit Logging</h3>
              <p className="text-purple-200">
                Complete activity tracking for compliance and accountability. Know who did what, when, and why.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-purple-800/30 backdrop-blur-sm border border-purple-700/50 rounded-lg p-6">
              <div className="bg-gradient-to-br from-purple-500 to-cyan-500 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
                <FileText className="h-6 w-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Bulk Import/Export</h3>
              <p className="text-purple-200">
                Import jobs from CSV, export data for reporting. Seamlessly integrate with your existing workflows.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="container mx-auto px-4 py-20">
        <div className="max-w-3xl mx-auto text-center bg-gradient-to-r from-purple-800/50 to-indigo-800/50 backdrop-blur-sm border border-purple-700/50 rounded-2xl p-12">
          <h2 className="text-4xl font-bold text-white mb-4">Ready to Transform Your Operations?</h2>
          <p className="text-xl text-purple-200 mb-8">
            Join the waitlist today and be among the first to experience the future of agricultural spray management.
          </p>
          <Button
            size="lg"
            onClick={() => setShowWaitlist(true)}
            className="bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold text-lg px-8"
          >
            Get Early Access Now
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-700/50 bg-purple-900/50 backdrop-blur-sm py-8">
        <div className="container mx-auto px-4 text-center text-purple-300">
          <p>&copy; 2025 Ready2Spray by GTM Planetary. All rights reserved.</p>
        </div>
      </footer>

      {/* Waitlist Modal */}
      <Dialog open={showWaitlist} onOpenChange={setShowWaitlist}>
        <DialogContent className="bg-purple-900 border-purple-700 text-white">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
              Join the Waitlist
            </DialogTitle>
            <DialogDescription className="text-purple-200">
              Ready2Spray is launching soon. Sign up now to be among the first to streamline your agricultural spraying operations.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-purple-200">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="bg-purple-800/50 border-purple-700 text-white placeholder:text-purple-400"
                placeholder="John Doe"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-purple-200">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="bg-purple-800/50 border-purple-700 text-white placeholder:text-purple-400"
                placeholder="john@example.com"
              />
            </div>
            <div>
              <Label htmlFor="company" className="text-purple-200">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                className="bg-purple-800/50 border-purple-700 text-white placeholder:text-purple-400"
                placeholder="Your Company Name"
              />
            </div>
            <div>
              <Label htmlFor="phone" className="text-purple-200">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-purple-800/50 border-purple-700 text-white placeholder:text-purple-400"
                placeholder="(555) 123-4567"
              />
            </div>
            <div>
              <Label htmlFor="message" className="text-purple-200">Message</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="bg-purple-800/50 border-purple-700 text-white placeholder:text-purple-400"
                placeholder="Tell us about your spray operations..."
                rows={3}
              />
            </div>
            <Button
              type="submit"
              className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-600 hover:to-cyan-600 text-white font-semibold"
              disabled={joinWaitlistMutation.isPending}
            >
              {joinWaitlistMutation.isPending ? "Joining..." : "Join Waitlist"}
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
