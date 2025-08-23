import { Metadata } from 'next'
import Link from 'next/link'
import Image from 'next/image'
import { Car, Wrench, Shield, Zap, Filter, Droplets } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Vehicle Parts - Mazda CX-5, Nissan X-Trail T30, Toyota Prado | Triomah Spares Ltd',
  description: 'Specialist car spare parts for Mazda CX-5, Nissan X-Trail T30, and Toyota Prado. Engine parts, brakes, suspension, electrical components.',
}

const vehicles = [
  {
    id: 'mazda-cx5',
    name: 'Mazda CX-5',
    image: '/images/mazda.jpeg',
    description: 'Quality spare parts for Mazda CX-5 models',
    parts: [
      {
        category: 'Engine & Filters',
        items: ['Engine Oil Filter', 'Air Filter', 'Fuel Filter', 'Spark Plugs', 'Timing Chain']
      },
      {
        category: 'Brakes',
        items: ['Brake Pads (Front)', 'Brake Pads (Rear)']
      },
      {
        category: 'Suspension & Steering',
        items: ['Shock Absorbers', 'Control Arms', 'Ball Joints']
      },
      {
        category: 'Transmission & Drivetrain',
        items: ['Clutch Kit', 'Drive Shafts']
      },
      {
        category: 'Cooling System',
        items: ['Radiator']
      },
      {
        category: 'Electrical',
        items: ['Alternator', 'Starter Motor', 'Battery']
      },
      {
        category: 'Body & Lighting',
        items: ['Headlights', 'Tail Lights', 'Side Mirrors', 'Wiper Blades']
      }
    ]
  },
  {
    id: 'nissan-xtrail',
    name: 'Nissan X-Trail T30',
    image: '/images/nissan.jpg',
    description: 'Reliable spare parts for Nissan X-Trail T30 models',
    parts: [
      {
        category: 'Engine & Filters',
        items: ['Engine Oil Filter', 'Air Filter', 'Fuel Pump', 'Spark Plugs', 'Timing Chain', 'Ignition Coils']
      },
      {
        category: 'Brakes',
        items: ['Brake Pads', 'Brake Discs']
      },
      {
        category: 'Suspension & Steering',
        items: ['Shock Absorbers', 'Suspension Bushes', 'Control Arms', 'Ball Joints']
      },
      {
        category: 'Transmission & Drivetrain',
        items: ['Clutch Kit', 'Drive Shafts']
      },
      {
        category: 'Cooling System',
        items: ['Radiator']
      },
      {
        category: 'Electrical',
        items: ['Alternator', 'Starter Motor', 'Battery']
      },
      {
        category: 'Body & Lighting',
        items: ['Headlights', 'Tail Lights']
      }
    ]
  },
  {
    id: 'toyota-prado',
    name: 'Toyota Prado',
    image: '/images/toyota.JPG',
    description: 'Premium spare parts for Toyota Prado models',
    parts: [
      {
        category: 'Engine & Filters',
        items: ['Engine Oil Filter', 'Air Filter', 'Fuel Filter', 'Spark Plugs', 'Timing Belt']
      },
      {
        category: 'Brakes',
        items: ['Brake Pads', 'Brake Discs']
      },
      {
        category: 'Suspension & Steering',
        items: ['Shock Absorbers', 'Suspension Arms', 'Control Arms', 'Ball Joints']
      },
      {
        category: 'Transmission & Drivetrain',
        items: ['Clutch Kit', 'Drive Shafts']
      },
      {
        category: 'Cooling System',
        items: ['Radiator', 'Water Pump']
      },
      {
        category: 'Electrical',
        items: ['Alternator', 'Starter Motor', 'Battery']
      },
      {
        category: 'Body & Lighting',
        items: ['Headlights', 'Tail Lights', 'Side Mirrors', 'Wiper Blades']
      }
    ]
  }
]

export default function VehiclesPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="bg-primary text-primary-foreground py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">
            Our Specialized Vehicle Parts
          </h1>
          <p className="text-xl text-primary-foreground/90 max-w-3xl mx-auto">
            Expert spare parts for Mazda CX-5, Nissan X-Trail T30, and Toyota Prado. 
            Quality components for engine, brakes, suspension, and electrical systems.
          </p>
        </div>
      </section>

      {/* Vehicle Selection */}
      <section className="section-padding">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {vehicles.map((vehicle) => (
              <div key={vehicle.id} className="bg-background rounded-xl shadow-lg border border-border overflow-hidden">
                {/* Vehicle Image */}
                <div className="relative h-48 bg-muted overflow-hidden">
                  <Image
                    src={vehicle.image}
                    alt={vehicle.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Vehicle Info */}
                <div className="p-6">
                  <h3 className="text-2xl font-bold text-foreground mb-2">{vehicle.name}</h3>
                  <p className="text-muted-foreground mb-6">{vehicle.description}</p>

                  {/* Parts Categories */}
                  <div className="space-y-4">
                    {vehicle.parts.map((partCategory, index) => (
                      <div key={index} className="border-l-4 border-primary pl-4">
                        <h4 className="font-semibold text-foreground mb-2">{partCategory.category}</h4>
                        <ul className="text-sm text-muted-foreground space-y-1">
                          {partCategory.items.map((item, itemIndex) => (
                            <li key={itemIndex} className="flex items-center space-x-2">
                              <Wrench className="h-3 w-3 text-primary" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>

                  {/* CTA Button */}
                  <div className="mt-6">
                    <Link
                      href={`/vehicles/${vehicle.id}`}
                      className="btn-primary w-full text-center"
                    >
                      View All Parts
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="section-padding bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Why Choose Triomah Spares?
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              We specialize in quality spare parts for your specific vehicle models
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="bg-primary/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Shield className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Quality Guaranteed</h3>
              <p className="text-muted-foreground">All parts meet or exceed OEM specifications</p>
            </div>

            <div className="text-center">
              <div className="bg-primary/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Wrench className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Expert Knowledge</h3>
              <p className="text-muted-foreground">Specialized in Mazda, Nissan, and Toyota parts</p>
            </div>

            <div className="text-center">
              <div className="bg-primary/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Zap className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Fast Delivery</h3>
              <p className="text-muted-foreground">Quick turnaround for all orders</p>
            </div>

            <div className="text-center">
              <div className="bg-primary/20 p-4 rounded-full w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                <Filter className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-2">Wide Selection</h3>
              <p className="text-muted-foreground">Comprehensive range of parts and components</p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact CTA */}
      <section className="section-padding bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Need Help Finding the Right Part?
          </h2>
          <p className="text-xl text-primary-foreground/90 mb-8 max-w-2xl mx-auto">
            Contact our experts for personalized assistance with your specific vehicle requirements
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {/* <Link href="/contact" className="btn-outline text-lg px-8 py-3 border-white text-white hover:bg-white hover:text-primary">
              Contact Us
            </Link> */}
            <Link href="tel:+447349013628" className="btn-primary text-lg px-8 py-3">
              Call Now: +44 7349 013628
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
