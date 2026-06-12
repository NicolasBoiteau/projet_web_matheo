import type { Metadata } from "next"
import { PageHeader } from "@/components/shared/PageHeader"
import { SITE_CONFIG } from "@/lib/utils/constants"

export const metadata: Metadata = {
  title: `Conditions d'utilisation — ${SITE_CONFIG.name}`,
  description:
    "Conditions générales d'utilisation du site et de l'espace membre des Écuries Arantino.",
}

export default function ConditionsUtilisationPage() {
  return (
    <>
      <PageHeader
        title="Conditions d'utilisation"
        subtitle="Les règles d'usage du site et de l'espace membre."
      />
      <section className="mx-auto max-w-3xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="space-y-8 text-sm leading-relaxed text-gray-600">
          <p className="text-gray-500">
            Dernière mise à jour : juin 2026. En créant un compte ou en utilisant ce
            site, vous acceptez les conditions ci-dessous.
          </p>

          <article className="space-y-3">
            <h2 className="font-display text-xl font-bold text-fir">1. Objet</h2>
            <p>
              Le site de {SITE_CONFIG.name} permet de consulter les prestations du
              centre équestre (pensions, cavalerie, stages, concours) et, via un espace
              membre, de s&apos;inscrire aux créneaux publiés par le centre. Aucun
              paiement n&apos;est effectué en ligne : le règlement se fait sur place.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="font-display text-xl font-bold text-fir">2. Compte membre</h2>
            <p>
              La création d&apos;un compte requiert une adresse email valide. Vous êtes
              responsable de la confidentialité de votre mot de passe et des activités
              réalisées depuis votre compte. Les informations fournies (nom, prénom,
              téléphone) doivent être exactes.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="font-display text-xl font-bold text-fir">
              3. Réservations
            </h2>
            <p>
              Une inscription à un créneau est d&apos;abord enregistrée en attente, puis
              confirmée par l&apos;équipe du centre selon les places disponibles. Le
              centre se réserve le droit d&apos;annuler ou de modifier un créneau ; vous
              en êtes alors informé. Toute annulation de votre part doit être faite dans
              un délai raisonnable.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="font-display text-xl font-bold text-fir">
              4. Données personnelles
            </h2>
            <p>
              Les données collectées servent uniquement à la gestion de votre compte, de
              vos réservations et à la communication du centre. Elles ne sont ni vendues
              ni cédées à des tiers. Vous pouvez demander leur consultation, leur
              rectification ou leur suppression en contactant le centre à l&apos;adresse{" "}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-gold hover:underline"
              >
                {SITE_CONFIG.email}
              </a>
              .
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="font-display text-xl font-bold text-fir">5. Responsabilité</h2>
            <p>
              Le centre s&apos;efforce d&apos;assurer l&apos;exactitude des informations
              publiées sans pouvoir le garantir. La pratique équestre comporte des
              risques inhérents ; les consignes de sécurité données sur place doivent
              être respectées.
            </p>
          </article>

          <article className="space-y-3">
            <h2 className="font-display text-xl font-bold text-fir">6. Contact</h2>
            <p>
              Pour toute question relative à ces conditions, contactez {SITE_CONFIG.name}{" "}
              à l&apos;adresse{" "}
              <a
                href={`mailto:${SITE_CONFIG.email}`}
                className="text-gold hover:underline"
              >
                {SITE_CONFIG.email}
              </a>
              .
            </p>
          </article>
        </div>
      </section>
    </>
  )
}
