"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Clock, Send } from "lucide-react"
import { Card, CardContent } from "@/components/ui/Card"
import { Button } from "@/components/ui/Button"
import { PageHeader } from "@/components/shared/PageHeader"
import { SITE_CONFIG } from "@/lib/utils/constants"

export default function ContactPage() {
  const [formState, setFormState] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    // Simulate API call
    await new Promise((r) => setTimeout(r, 1000))
    setIsSubmitting(false)
    setSubmitted(true)
  }

  return (
    <div>
      <PageHeader
        title="Contact"
        subtitle="Une question ? Envie de visiter nos installations ? N'hésitez pas à nous contacter."
      />

      <section className="relative -mt-8 pb-24">
        <div className="mx-auto max-w-7xl px-4 lg:px-8">
          <div className="grid gap-8 lg:grid-cols-5">
            {/* Info Cards */}
            <div className="space-y-6 lg:col-span-2">
              <Card className="border-fir/5">
                <CardContent className="flex items-start gap-4 p-6">
                  <MapPin className="mt-1 h-5 w-5 shrink-0 text-gold" />
                  <div>
                    <h4 className="font-semibold text-fir">Adresse</h4>
                    <p className="text-sm text-gray-600">
                      {SITE_CONFIG.address.street}
                      <br />
                      {SITE_CONFIG.address.postalCode} {SITE_CONFIG.address.city}
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-fir/5">
                <CardContent className="flex items-start gap-4 p-6">
                  <Phone className="mt-1 h-5 w-5 shrink-0 text-gold" />
                  <div>
                    <h4 className="font-semibold text-fir">Téléphone</h4>
                    <a href={`tel:${SITE_CONFIG.phone}`} className="text-sm text-gold hover:underline">
                      {SITE_CONFIG.phone}
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-fir/5">
                <CardContent className="flex items-start gap-4 p-6">
                  <Mail className="mt-1 h-5 w-5 shrink-0 text-gold" />
                  <div>
                    <h4 className="font-semibold text-fir">Email</h4>
                    <a href={`mailto:${SITE_CONFIG.email}`} className="text-sm text-gold hover:underline">
                      {SITE_CONFIG.email}
                    </a>
                  </div>
                </CardContent>
              </Card>

              <Card className="border-fir/5">
                <CardContent className="flex items-start gap-4 p-6">
                  <Clock className="mt-1 h-5 w-5 shrink-0 text-gold" />
                  <div>
                    <h4 className="font-semibold text-fir">Horaires</h4>
                    <p className="text-sm text-gray-600">
                      Lun-Ven : {SITE_CONFIG.hours.weekdays}
                      <br />
                      Sam-Dim : {SITE_CONFIG.hours.weekend}
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Google Maps */}
              <div className="overflow-hidden rounded-2xl border border-fir/5">
                <div className="aspect-[4/3] bg-fir/5">
                  <iframe
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d10500!2d2.228!3d48.562!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zNDjCsDMzJzQzLjIiTiAywrAxMyc0MC44IkU!5e0!3m2!1sfr!2sfr!4v1"
                    width="100%"
                    height="100%"
                    style={{ border: 0, minHeight: "250px" }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title="Carte Avrainville"
                  />
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-3">
              <Card className="border-fir/5">
                <CardContent className="p-8">
                  <h3 className="mb-6 font-display text-2xl font-bold text-fir">
                    Envoyez-nous un message
                  </h3>

                  {submitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="flex flex-col items-center py-12 text-center"
                    >
                      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
                        <Send className="h-8 w-8 text-gold" />
                      </div>
                      <h4 className="text-xl font-semibold text-fir">Message envoyé !</h4>
                      <p className="mt-2 text-gray-600">
                        Nous vous répondrons dans les plus brefs délais.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleSubmit} className="space-y-5">
                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label htmlFor="firstName" className="mb-1.5 block text-sm font-medium text-fir">
                            Prénom *
                          </label>
                          <input
                            id="firstName"
                            required
                            value={formState.firstName}
                            onChange={(e) => setFormState({ ...formState, firstName: e.target.value })}
                            className="w-full rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                            placeholder="Votre prénom"
                          />
                        </div>
                        <div>
                          <label htmlFor="lastName" className="mb-1.5 block text-sm font-medium text-fir">
                            Nom *
                          </label>
                          <input
                            id="lastName"
                            required
                            value={formState.lastName}
                            onChange={(e) => setFormState({ ...formState, lastName: e.target.value })}
                            className="w-full rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                            placeholder="Votre nom"
                          />
                        </div>
                      </div>

                      <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                          <label htmlFor="email" className="mb-1.5 block text-sm font-medium text-fir">
                            Email *
                          </label>
                          <input
                            id="email"
                            type="email"
                            required
                            value={formState.email}
                            onChange={(e) => setFormState({ ...formState, email: e.target.value })}
                            className="w-full rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                            placeholder="votre@email.fr"
                          />
                        </div>
                        <div>
                          <label htmlFor="phone" className="mb-1.5 block text-sm font-medium text-fir">
                            Téléphone
                          </label>
                          <input
                            id="phone"
                            type="tel"
                            value={formState.phone}
                            onChange={(e) => setFormState({ ...formState, phone: e.target.value })}
                            className="w-full rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                            placeholder="06 XX XX XX XX"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="subject" className="mb-1.5 block text-sm font-medium text-fir">
                          Sujet *
                        </label>
                        <select
                          id="subject"
                          required
                          value={formState.subject}
                          onChange={(e) => setFormState({ ...formState, subject: e.target.value })}
                          className="w-full rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold"
                        >
                          <option value="">Sélectionnez un sujet</option>
                          <option value="pension">Demande de pension</option>
                          <option value="stage">Inscription à un stage</option>
                          <option value="visite">Demande de visite</option>
                          <option value="cheval">Cheval à vendre</option>
                          <option value="autre">Autre</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="message" className="mb-1.5 block text-sm font-medium text-fir">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          required
                          rows={5}
                          value={formState.message}
                          onChange={(e) => setFormState({ ...formState, message: e.target.value })}
                          className="w-full rounded-xl border border-fir/10 bg-white px-4 py-3 text-sm transition-colors focus:border-gold focus:outline-none focus:ring-1 focus:ring-gold resize-y"
                          placeholder="Votre message..."
                        />
                      </div>

                      <Button type="submit" variant="primary" size="lg" loading={isSubmitting} className="w-full sm:w-auto">
                        {isSubmitting ? "Envoi en cours..." : "Envoyer le message"}
                      </Button>
                    </form>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}