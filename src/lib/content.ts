import type {
  PensionPack,
  TeamMember,
  EventItem,
  HomeService,
  HomeStat,
  Testimonial,
} from "@/lib/supabase/types"

/**
 * Données de repli (le contenu mock d'origine). Utilisées tant que Supabase
 * n'est pas configuré, pour que le site reste identique sans backend.
 * Une fois Supabase branché, ce sont les données de la base qui priment.
 */

const ts = { created_at: "", updated_at: "" }

export const FALLBACK_PENSIONS: PensionPack[] = [
  { id: "box", slug: "box", name: "Box Premium", description: null, price_cents: 65000, is_featured: false, is_available: true, sort_order: 1, ...ts,
    features: ["Box grande taille (4x4m)", "Paille ou copeaux au choix", "2 repas par jour sur-mesure", "Mise au paddock quotidienne", "Paillage quotidien", "Accès carrière et manège"] },
  { id: "paddock", slug: "paddock", name: "Paddock Paradise", description: null, price_cents: 45000, is_featured: false, is_available: true, sort_order: 2, ...ts,
    features: ["Paddock individuel ou collectif", "Abri et point d'eau automatique", "Distribution fourrage", "Accès carrière et manège", "Suivi nutritionnel de base", "Surveillance quotidienne"] },
  { id: "complet", slug: "complet", name: "Pack Compétition", description: null, price_cents: 95000, is_featured: true, is_available: true, sort_order: 3, ...ts,
    features: ["Box Premium + Paddock", "Coaching personnalisé 2x/semaine", "Planning compétition sur-mesure", "Transport aux concours", "Ostéopathe et dentiste inclus", "Suivi vétérinaire prioritaire", "Accès illimité aux installations"] },
]

export const FALLBACK_TEAM: TeamMember[] = [
  { id: "1", name: "Thomas Delacroix", role: "Fondateur & Gérant", email: null, phone: null, portrait_url: null, is_published: true, sort_order: 1, ...ts,
    bio: "Passionné d'équitation depuis toujours, Thomas a fondé Les Écuries Arantino avec une vision : créer un centre d'excellence où chaque cavalier peut progresser dans un cadre convivial et professionnel.",
    specialties: ["Saut d'obstacles", "Concours complet", "Valorisation"], diplomas: ["BEES 1er degré", "BPJEPS Équitation", "FEI Level 2 Coach"] },
  { id: "2", name: "Camille Renard", role: "Coach Sportif & CSO", email: null, phone: null, portrait_url: null, is_published: true, sort_order: 2, ...ts,
    bio: "Ancienne compétitrice de niveau international, Camille met son expérience au service des cavaliers pour les aider à atteindre leurs objectifs, du galop au parcours de CSO.",
    specialties: ["CSO", "Travail à plat", "Préparation concours"], diplomas: ["BEES 2ème degré", "Monitrice fédérale"] },
  { id: "3", name: "Antoine Lefèvre", role: "Responsable Écurie & Pensions", email: null, phone: null, portrait_url: null, is_published: true, sort_order: 3, ...ts,
    bio: "Antoine assure le bien-être de chaque cheval au quotidien. Sa rigueur et son attention aux détails font de lui le garant de la qualité de nos pensions.",
    specialties: ["Soins équins", "Nutrition", "Gestion écurie"], diplomas: ["Bac Pro CGEA Équin", "Certificat Soins Équins"] },
]

export const FALLBACK_EVENTS: EventItem[] = [
  { id: "1", title: "Stage CSO — Perfectionnement", date_label: "15-16 Juin 2026", time_label: "9h00 - 17h00", instructor: "Camille Renard", level: "Galop 5+", places: 6, price_cents: 25000, location: "Avrainville", is_featured: false, is_published: true, sort_order: 1, ...ts,
    description: "Stage intensif de saut d'obstacles axé sur le perfectionnement des trajectoires et la gestion des parcours." },
  { id: "2", title: "Stage CCE — Préparation Concours", date_label: "22-24 Juillet 2026", time_label: "8h30 - 18h00", instructor: "Thomas Delacroix", level: "Galop 4+", places: 4, price_cents: 48000, location: "Avrainville", is_featured: true, is_published: true, sort_order: 2, ...ts,
    description: "Stage complet de concours complet sur 3 jours avec cross, dressage et CSO." },
  { id: "3", title: "Stage Dressage — Niveaux 1", date_label: "5-6 Septembre 2026", time_label: "10h00 - 16h00", instructor: "Camille Renard", level: "Galop 3-5", places: 8, price_cents: 20000, location: "Avrainville", is_featured: false, is_published: true, sort_order: 3, ...ts,
    description: "Initiation et perfectionnement au dressage, travail à plat, assouplissements et figures de manège." },
]

export const FALLBACK_SERVICES: HomeService[] = [
  { id: "1", icon: "Building2", title: "Pensions sur-mesure", description: "Box premium, paddock paradise ou pack compétition — chaque cheval a son programme adapté.", sort_order: 1, ...ts },
  { id: "2", icon: "Award", title: "Coaching personnalisé", description: "Un suivi individuel pour progresser à votre rythme, quel que soit votre niveau.", sort_order: 2, ...ts },
  { id: "3", icon: "GraduationCap", title: "Stages & intervenants", description: "Des stages toute l'année avec des professionnels reconnus et des intervenants de haut niveau.", sort_order: 3, ...ts },
  { id: "4", icon: "Truck", title: "Valorisation & commerce", description: "Valorisation de chevaux, préparation aux concours et mise en vente accompagnée.", sort_order: 4, ...ts },
  { id: "5", icon: "ClipboardCheck", title: "Suivi compétition", description: "Planning sur-mesure, transport aux concours et accompagnement en compétition.", sort_order: 5, ...ts },
  { id: "6", icon: "Rabbit", title: "Installations pro", description: "Carrière, manège, paddocks, boxes grandes tailles — des équipements haut de gamme.", sort_order: 6, ...ts },
]

export const FALLBACK_STATS: HomeStat[] = [
  { id: "1", value: 30, suffix: "+", label: "Chevaux en pension", sort_order: 1, ...ts },
  { id: "2", value: 15, suffix: "+", label: "Années d'expérience", sort_order: 2, ...ts },
  { id: "3", value: 500, suffix: "+", label: "Cavaliers formés", sort_order: 3, ...ts },
  { id: "4", value: 10, suffix: " ha", label: "D'installations", sort_order: 4, ...ts },
]

export const FALLBACK_TESTIMONIALS: Testimonial[] = [
  { id: "1", author: "Sophie L.", context: "Propriétaire de Uranus", rating: 5, is_published: true, sort_order: 1, ...ts,
    content: "Un cadre exceptionnel et une équipe passionnée. Mon cheval s'épanouit dans sa pension et j'ai fait d'énormes progrès en coaching." },
  { id: "2", author: "Marc D.", context: "Propriétaire de Belle de Nuit", rating: 5, is_published: true, sort_order: 2, ...ts,
    content: "Je n'aurais jamais cru trouver un tel niveau de professionnalisme. Le suivi compétition est juste incroyable, des résultats concrets dès les premiers mois." },
  { id: "3", author: "Claire M.", context: "Propriétaire de Voltaire", rating: 5, is_published: true, sort_order: 3, ...ts,
    content: "Les installations sont magnifiques et l'ambiance est tellement conviviale. On se sent vraiment comme à la maison. Je recommande les yeux fermés !" },
]
