import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calculator, Building, FileText, Users } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center space-x-3">
              <Building className="h-8 w-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">
                Oral Surgeon Office Cost Estimator
              </h1>
            </div>
            <Button variant="outline">Sign In</Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            AI-Powered Construction Cost Estimation
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Get accurate, detailed construction estimates for oral surgeon offices.
            Our intelligent system considers every aspect from medical gas systems to specialized equipment integration.
          </p>
          <Link href="/estimate/new">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
              <Calculator className="mr-2 h-5 w-5" />
              Start New Estimate
            </Button>
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h3 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Comprehensive Estimation Features
          </h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card>
              <CardHeader>
                <Building className="h-10 w-10 text-blue-600 mb-3" />
                <CardTitle>Detailed Scope Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Complete breakdown including demolition, framing, MEP systems,
                  medical gas, and specialized equipment installation.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Calculator className="h-10 w-10 text-green-600 mb-3" />
                <CardTitle>AI-Driven Pricing</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Smart algorithms that factor in regional costs, equipment specifications,
                  and industry standards for accurate estimates.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <FileText className="h-10 w-10 text-purple-600 mb-3" />
                <CardTitle>Professional Reports</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Generate detailed PDF estimates with line-item breakdowns,
                  visual cost allocation, and professional formatting.
                </CardDescription>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <Users className="h-10 w-10 text-orange-600 mb-3" />
                <CardTitle>User-Friendly Interface</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Step-by-step guided process with intelligent suggestions
                  and validation to ensure nothing is missed.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Recent Estimates */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-3xl font-bold text-gray-900">Recent Estimates</h3>
            <Link href="/estimates">
              <Button variant="outline">View All</Button>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-lg">Modern Oral Surgery Center</CardTitle>
                    <CardDescription>3,900 sq ft • 6 operatories</CardDescription>
                  </div>
                  <span className="text-2xl font-bold text-green-600">$485K</span>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Created:</span>
                    <span>Dec 28, 2024</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Status:</span>
                    <span className="text-blue-600">Draft</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="border-dashed border-2 flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <Calculator className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-4">Start your first estimate</p>
                <Link href="/estimate/new">
                  <Button>Create Estimate</Button>
                </Link>
              </div>
            </Card>

            <Card className="border-dashed border-2 flex items-center justify-center min-h-[200px] opacity-50">
              <div className="text-center">
                <FileText className="h-12 w-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-400">Future estimates will appear here</p>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <Building className="h-6 w-6" />
                <span className="font-bold">Cost Estimator</span>
              </div>
              <p className="text-gray-400 text-sm">
                Professional construction cost estimation for oral surgeon offices.
              </p>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Features</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>AI-Powered Estimates</li>
                <li>Professional Reports</li>
                <li>Equipment Integration</li>
                <li>Regional Pricing</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Support</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>Documentation</li>
                <li>Contact Support</li>
                <li>Training Videos</li>
                <li>FAQ</li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-gray-400">
                <li>About Us</li>
                <li>Privacy Policy</li>
                <li>Terms of Service</li>
                <li>Contact</li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
            © 2024 Oral Surgeon Cost Estimator. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
