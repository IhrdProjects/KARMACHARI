import React from 'react'
import { Link } from 'react-router-dom'

export default function Navbar(){
  return (
    <header className="bg-white border-b">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <div className="header-emblem">
            {/* placeholder emblem */}
            <img src="/logo.png" alt="Emblem" className="w-10 h-10 object-contain" />
          </div>
          <div>
            <div className="header-title">Karmachari Portal</div>
            <div className="text-sm text-gray-600">Digital Workforce — Government of Kerala</div>
          </div>
        </div>
        <nav className="flex items-center gap-3">
          <Link to="/" className="text-sm text-gray-700 hover:text-govblue">Home</Link>
          <Link to="/employer" className="btn-outline">Employer</Link>
          <Link to="/login" className="btn-primary">Login / Register</Link>
        </nav>
      </div>
    </header>
  )
}
