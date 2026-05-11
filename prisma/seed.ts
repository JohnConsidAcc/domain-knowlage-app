import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const questions = [
  {
    prompt: 'What does SIP stand for in VoIP telephony?',
    answers: [
      { text: 'Session Initiation Protocol', isCorrect: true },
      { text: 'Signal Integration Process', isCorrect: false },
      { text: 'Secure Internet Protocol', isCorrect: false },
      { text: 'Subscriber Identity Provider', isCorrect: false },
    ],
  },
  {
    prompt: 'Which layer of the OSI model does IP operate at?',
    answers: [
      { text: 'Network layer (Layer 3)', isCorrect: true },
      { text: 'Data link layer (Layer 2)', isCorrect: false },
      { text: 'Transport layer (Layer 4)', isCorrect: false },
      { text: 'Application layer (Layer 7)', isCorrect: false },
    ],
  },
  {
    prompt: 'What is the primary purpose of a SIM card in mobile networks?',
    answers: [
      { text: 'To authenticate the subscriber to the mobile network', isCorrect: true },
      { text: 'To store the device\'s operating system', isCorrect: false },
      { text: 'To boost cellular signal strength', isCorrect: false },
      { text: 'To connect the phone to Wi-Fi networks', isCorrect: false },
    ],
  },
  {
    prompt: 'What technology is LTE (Long-Term Evolution) based on?',
    answers: [
      { text: 'OFDMA (Orthogonal Frequency Division Multiple Access)', isCorrect: true },
      { text: 'CDMA (Code Division Multiple Access)', isCorrect: false },
      { text: 'TDMA (Time Division Multiple Access)', isCorrect: false },
      { text: 'FDMA (Frequency Division Multiple Access)', isCorrect: false },
    ],
  },
  {
    prompt: 'What does IMSI stand for?',
    answers: [
      { text: 'International Mobile Subscriber Identity', isCorrect: true },
      { text: 'Internal Mobile Signal Indicator', isCorrect: false },
      { text: 'Integrated Mobile Station Interface', isCorrect: false },
      { text: 'International Messaging Service Identifier', isCorrect: false },
    ],
  },
  {
    prompt: 'In 5G architecture, what is a "network slice"?',
    answers: [
      { text: 'A logically isolated end-to-end network customised for a specific use case', isCorrect: true },
      { text: 'A physical cable segment in the core network', isCorrect: false },
      { text: 'A type of antenna sector configuration', isCorrect: false },
      { text: 'A billing partition in the charging system', isCorrect: false },
    ],
  },
  {
    prompt: 'What is the role of the HLR (Home Location Register) in GSM networks?',
    answers: [
      { text: 'It stores subscriber data and current location of all registered users', isCorrect: true },
      { text: 'It handles inter-cell handover decisions', isCorrect: false },
      { text: 'It encrypts voice calls between base stations', isCorrect: false },
      { text: 'It routes SMS messages between carriers', isCorrect: false },
    ],
  },
  {
    prompt: 'Which protocol is commonly used for transporting real-time audio and video over IP networks?',
    answers: [
      { text: 'RTP (Real-time Transport Protocol)', isCorrect: true },
      { text: 'FTP (File Transfer Protocol)', isCorrect: false },
      { text: 'SMTP (Simple Mail Transfer Protocol)', isCorrect: false },
      { text: 'SNMP (Simple Network Management Protocol)', isCorrect: false },
    ],
  },
  {
    prompt: 'What is "number portability" in the context of telecom?',
    answers: [
      { text: 'The ability for a subscriber to keep their phone number when switching carrier', isCorrect: true },
      { text: 'The ability to use a phone in multiple countries without roaming fees', isCorrect: false },
      { text: 'Transferring contacts between phone devices', isCorrect: false },
      { text: 'Storing phone numbers in the cloud instead of on a SIM', isCorrect: false },
    ],
  },
  {
    prompt: 'In the context of mobile networks, what does "handover" (or "handoff") mean?',
    answers: [
      { text: 'Transferring an active call from one base station (cell) to another', isCorrect: true },
      { text: 'Passing a subscriber\'s billing record to a partner carrier', isCorrect: false },
      { text: 'Upgrading a 4G connection to a 5G connection mid-session', isCorrect: false },
      { text: 'Routing an incoming call to voicemail when the phone is busy', isCorrect: false },
    ],
  },
  {
    prompt: 'What does QoS (Quality of Service) primarily control in a telecom network?',
    answers: [
      { text: 'Traffic prioritisation to ensure acceptable performance for different services', isCorrect: true },
      { text: 'The physical quality of the cable infrastructure', isCorrect: false },
      { text: 'Customer service response times', isCorrect: false },
      { text: 'Security audits of network equipment', isCorrect: false },
    ],
  },
  {
    prompt: 'What is an MSISDN?',
    answers: [
      { text: 'The phone number used to route calls and SMS to a mobile subscriber', isCorrect: true },
      { text: 'A unique hardware ID burned into the SIM chip', isCorrect: false },
      { text: 'A code that identifies the mobile network operator', isCorrect: false },
      { text: 'The encryption key used in 4G voice calls', isCorrect: false },
    ],
  },
  {
    prompt: 'Which protocol does SS7 use to support inter-carrier SMS delivery?',
    answers: [
      { text: 'MAP (Mobile Application Part)', isCorrect: true },
      { text: 'SIP (Session Initiation Protocol)', isCorrect: false },
      { text: 'DIAMETER', isCorrect: false },
      { text: 'SCTP (Stream Control Transmission Protocol)', isCorrect: false },
    ],
  },
  {
    prompt: 'What is the difference between FDD and TDD in LTE?',
    answers: [
      { text: 'FDD uses separate frequency bands for uplink and downlink; TDD uses time slots on the same frequency', isCorrect: true },
      { text: 'FDD is used outdoors; TDD is used for indoor small cells only', isCorrect: false },
      { text: 'FDD supports voice; TDD supports data only', isCorrect: false },
      { text: 'FDD is a 4G standard; TDD is a 5G standard', isCorrect: false },
    ],
  },
  {
    prompt: 'What is a CDR (Call Detail Record) used for in telecom?',
    answers: [
      { text: 'Recording metadata about each call or data session for billing and analytics', isCorrect: true },
      { text: 'Storing the audio content of recorded calls', isCorrect: false },
      { text: 'Logging network alarm events from base stations', isCorrect: false },
      { text: 'Defining routing rules in the IMS core', isCorrect: false },
    ],
  },
]

async function main() {
  // Upsert a system seed user so questions have a valid createdBy reference
  const seedUser = await prisma.user.upsert({
    where: { email: 'seed@system.local' },
    update: {},
    create: {
      subject: 'seed-system',
      email: 'seed@system.local',
      name: 'Seed Script',
    },
  })

  console.log(`Seed user ready: ${seedUser.email}`)

  let created = 0
  let skipped = 0

  for (const q of questions) {
    const existing = await prisma.question.findFirst({
      where: { prompt: q.prompt },
    })

    if (existing) {
      skipped++
      continue
    }

    await prisma.question.create({
      data: {
        prompt: q.prompt,
        createdById: seedUser.id,
        answers: { create: q.answers },
      },
    })
    created++
  }

  console.log(`Done — ${created} questions created, ${skipped} already existed.`)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(() => prisma.$disconnect())
