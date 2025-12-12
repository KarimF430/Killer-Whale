import Link from 'next/link'
import { Mail, Phone, MapPin, Facebook, Twitter, Instagram, Youtube } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="space-y-4">
            <Link href="/" className="inline-block group">
              <span className="text-2xl font-bold bg-gradient-to-r from-red-500 to-orange-400 bg-clip-text text-transparent group-hover:from-red-400 group-hover:to-orange-300 transition-all">gadizone</span>
            </Link>
            <p className="text-gray-300 text-sm leading-relaxed">
              Your trusted partner for finding the perfect new car in India. Compare prices,
              specifications, reviews, and get the best deals from authorized dealers.
            </p>
            <div className="flex space-x-4">
              <a href="https://facebook.com/gadizone" className="text-gray-400 hover:text-red-400 transition-colors" aria-label="Follow us on Facebook">
                <Facebook className="h-5 w-5" />
              </a>
              <a href="https://twitter.com/gadizone" className="text-gray-400 hover:text-orange-400 transition-colors" aria-label="Follow us on Twitter">
                <Twitter className="h-5 w-5" />
              </a>
              <a href="https://instagram.com/gadizone" className="text-gray-400 hover:text-red-400 transition-colors" aria-label="Follow us on Instagram">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="https://youtube.com/gadizone" className="text-gray-400 hover:text-orange-400 transition-colors" aria-label="Subscribe to our YouTube channel">
                <Youtube className="h-5 w-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/new-cars" className="text-gray-300 hover:text-red-400 transition-colors">
                  New Cars
                </Link>
              </li>
              <li>
                <Link href="/compare" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Compare Cars
                </Link>
              </li>
              <li>
                <Link href="/brands" className="text-gray-300 hover:text-red-400 transition-colors">
                  Car Brands
                </Link>
              </li>
              <li>
                <Link href="/emi-calculator" className="text-gray-300 hover:text-orange-400 transition-colors">
                  EMI Calculator
                </Link>
              </li>
              <li>
                <Link href="/news" className="text-gray-300 hover:text-red-400 transition-colors">
                  Car News
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Brands */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Popular Brands</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/cars/maruti-suzuki" className="text-gray-300 hover:text-red-400 transition-colors">
                  Maruti Suzuki
                </Link>
              </li>
              <li>
                <Link href="/cars/hyundai" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Hyundai
                </Link>
              </li>
              <li>
                <Link href="/cars/tata" className="text-gray-300 hover:text-red-400 transition-colors">
                  Tata
                </Link>
              </li>
              <li>
                <Link href="/cars/mahindra" className="text-gray-300 hover:text-orange-400 transition-colors">
                  Mahindra
                </Link>
              </li>
              <li>
                <Link href="/cars/kia" className="text-gray-300 hover:text-red-400 transition-colors">
                  Kia
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Contact Us</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-red-400" />
                <a href="mailto:info@gadizone.com" className="text-gray-300 hover:text-red-400 transition-colors">
                  info@gadizone.com
                </a>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-orange-400" />
                <a href="tel:+919876543210" className="text-gray-300 hover:text-orange-400 transition-colors">
                  +91 98765 43210
                </a>
              </div>
              <div className="flex items-start space-x-3">
                <MapPin className="h-4 w-4 text-red-400 mt-0.5" />
                <span className="text-gray-300">
                  gadizone Technologies Pvt. Ltd.<br />
                  Cyber City, Gurgaon, Haryana 122002
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 text-sm">
              © 2024 gadizone. All rights reserved.
            </p>
            <div className="flex space-x-6 text-sm">
              <Link href="/privacy-policy" className="text-gray-400 hover:text-red-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms-of-service" className="text-gray-400 hover:text-orange-400 transition-colors">
                Terms of Service
              </Link>
              <Link href="/about" className="text-gray-400 hover:text-red-400 transition-colors">
                About Us
              </Link>
              <Link href="/contact" className="text-gray-400 hover:text-orange-400 transition-colors">
                Contact
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
