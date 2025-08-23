'use client'

import { useState } from 'react'
import Link from 'next/link'
import { ChevronDown, ChevronUp } from 'lucide-react'

const popularBrands = [
  { name: "Duralast Gold Chassis", href: "/brands/duralast-gold" },
  { name: "AC Pro", href: "/brands/ac-pro" },
  { name: "ACDelco", href: "/brands/acdelco" },
  { name: "Sylvania", href: "/brands/sylvania" },
  { name: "Castrol", href: "/brands/castrol" },
  { name: "Bosch", href: "/brands/bosch" },
  { name: "Mobil1", href: "/brands/mobil-1" },
  { name: "Pennzoil", href: "/brands/pennzoil" },
  { name: "Valvoline", href: "/brands/valvoline" },
  { name: "Rain-X", href: "/brands/rain-x" }
]

const popularMakes = [
  { name: "Ford Parts", href: "/parts/ford" },
  { name: "Chevy Parts", href: "/parts/chevrolet" },
  { name: "Honda Parts", href: "/parts/honda" },
  { name: "Toyota Parts", href: "/parts/toyota" },
  { name: "Dodge Parts", href: "/parts/dodge" },
  { name: "Nissan Parts", href: "/parts/nissan" },
  { name: "Jeep Parts", href: "/parts/jeep" },
  { name: "Hyundai Parts", href: "/parts/hyundai" },
  { name: "Kia Parts", href: "/parts/kia" },
  { name: "Subaru Parts", href: "/parts/subaru" }
]

const popularModels = [
  { name: "Honda Accord Parts", href: "/parts/honda/accord" },
  { name: "Honda Civic Parts", href: "/parts/honda/civic" },
  { name: "Ford F150 Parts", href: "/parts/ford/f150" },
  { name: "Chevy Silverado 1500 Parts", href: "/parts/chevrolet/silverado-1500" },
  { name: "Toyota Camry Parts", href: "/parts/toyota/camry" },
  { name: "Toyota Corolla Parts", href: "/parts/toyota/corolla" },
  { name: "Nissan Altima Parts", href: "/parts/nissan/altima" },
  { name: "Dodge Ram 1500 Parts", href: "/parts/dodge/ram-1500" },
  { name: "Ford Focus Parts", href: "/parts/ford/focus" },
  { name: "Chevy Malibu Parts", href: "/parts/chevrolet/malibu" }
]

const adviceAndHowTos = [
  { name: "What Does the Battery Light Mean?", href: "/diy/battery/battery-light-on-car" },
  { name: "How Long Does an Oil Change Take?", href: "/diy/motor-oil/how-long-does-an-oil-change-take" },
  { name: "Why is My Check Engine Light On?", href: "/diy/maintenance/top-five-reasons-check-engine-light" },
  { name: "How to Replace Brakes", href: "/diy/brakes/how-to-replace-brake-pads-and-rotors" },
  { name: "How to Replace a Car Battery", href: "/diy/battery/how-to-replace-a-car-battery" },
  { name: "What Type of Windshield Wiper Blades Do I Need?", href: "/diy/wipers/types-of-wiper-blades" },
  { name: "How to Change Your Oil", href: "/diy/motor-oil/easy-steps-to-change-your-oil" },
  { name: "How to Remove Corrosion from Your Car Battery", href: "/diy/battery/clean-car-battery-corrosion" },
  { name: "How To Tell If Your Mass Air Flow Sensor Is Bad", href: "/diy/engine/bad-maf-sensor-symptoms" },
  { name: "How to Remove Moisture from Headlights", href: "/diy/lighting/how-to-remove-moisture-from-headlights" }
]

interface CategoryColumnProps {
  title: string
  items: Array<{ name: string; href: string }>
}

function CategoryColumn({ title, items }: CategoryColumnProps) {
  const [isExpanded, setIsExpanded] = useState(true)
  const [showAll, setShowAll] = useState(false)

  const visibleItems = showAll ? items : items.slice(0, 5)

  return (
    <div className="bg-white rounded-lg p-6 shadow-lg">
      <h3 className="text-xl font-bold text-gray-900 mb-4">{title}</h3>
      <ul className="space-y-2">
        {visibleItems.map((item, index) => (
          <li key={index}>
            <Link
              href={item.href}
              className="text-gray-600 hover:text-primary transition-colors duration-200 block py-1"
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
      {items.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="mt-4 text-primary hover:text-primary/80 font-medium flex items-center space-x-1 transition-colors duration-200"
        >
          <span>{showAll ? 'Show Less' : `Show ${items.length - 5} More`}</span>
          {showAll ? (
            <ChevronUp className="h-4 w-4" />
          ) : (
            <ChevronDown className="h-4 w-4" />
          )}
        </button>
      )}
    </div>
  )
}

export function PopularCategories() {
  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Popular Categories
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Find the parts and advice you need for your vehicle
          </p>
        </div>

        {/* Three Column Layout */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <CategoryColumn title="Popular Brands" items={popularBrands} />
          <CategoryColumn title="Popular Makes" items={popularMakes} />
          <CategoryColumn title="Popular Models" items={popularModels} />
        </div>

        {/* Advice and How-To Section */}
        <div className="mt-12">
          <CategoryColumn title="Advice and How-To's" items={adviceAndHowTos} />
        </div>
      </div>
    </section>
  )
}
