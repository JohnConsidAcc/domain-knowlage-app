import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

const questions = [
  // ── Protocols & signalling ────────────────────────────────────────────────
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
  // ── 3G / UMTS ─────────────────────────────────────────────────────────────
  {
    prompt: 'What does UMTS stand for?',
    answers: [
      { text: 'Universal Mobile Telecommunications System', isCorrect: true },
      { text: 'Unified Mobile Transfer Service', isCorrect: false },
      { text: 'Universal Multimedia Transmission Standard', isCorrect: false },
      { text: 'Unified Mobile Technology System', isCorrect: false },
    ],
  },
  {
    prompt: 'Which radio access technology does UMTS (3G) use?',
    answers: [
      { text: 'W-CDMA (Wideband Code Division Multiple Access)', isCorrect: true },
      { text: 'OFDMA (Orthogonal Frequency Division Multiple Access)', isCorrect: false },
      { text: 'TDMA (Time Division Multiple Access)', isCorrect: false },
      { text: 'FDMA (Frequency Division Multiple Access)', isCorrect: false },
    ],
  },
  {
    prompt: 'What does HSPA stand for?',
    answers: [
      { text: 'High Speed Packet Access — an enhancement of 3G UMTS (HSDPA + HSUPA)', isCorrect: true },
      { text: 'High-frequency Spectrum Packet Allocation', isCorrect: false },
      { text: 'Hybrid Switching Protocol Architecture', isCorrect: false },
      { text: 'Home Subscriber Profile Aggregation', isCorrect: false },
    ],
  },
  {
    prompt: 'What is GPRS in the context of mobile history?',
    answers: [
      { text: 'General Packet Radio Service — the first packet data overlay on GSM networks (2.5G)', isCorrect: true },
      { text: 'Global Positioning and Routing System', isCorrect: false },
      { text: 'GSM Packet Radio Standard', isCorrect: false },
      { text: 'General Purpose Radio Service', isCorrect: false },
    ],
  },
  {
    prompt: 'What is EDGE in mobile technology?',
    answers: [
      { text: 'Enhanced Data rates for GSM Evolution — a higher-speed extension of GPRS on 2G', isCorrect: true },
      { text: 'An SD-WAN protocol for enterprise branch connectivity', isCorrect: false },
      { text: 'A low-latency extension of LTE for edge computing', isCorrect: false },
      { text: 'An encryption standard for 2G voice calls', isCorrect: false },
    ],
  },
  // ── LTE / 4G core ─────────────────────────────────────────────────────────
  {
    prompt: 'What does EPC stand for in the context of LTE?',
    answers: [
      { text: 'Evolved Packet Core', isCorrect: true },
      { text: 'Enhanced Protocol Controller', isCorrect: false },
      { text: 'Extended Physical Channel', isCorrect: false },
      { text: 'Enterprise PBX Controller', isCorrect: false },
    ],
  },
  {
    prompt: 'What is the role of the MME (Mobility Management Entity) in LTE?',
    answers: [
      { text: 'Handles mobility signalling, authentication and session management for UEs', isCorrect: true },
      { text: 'Routes user data packets between the RAN and the internet', isCorrect: false },
      { text: 'Manages frequency allocation across eNodeBs', isCorrect: false },
      { text: 'Provides charging and billing functions for data sessions', isCorrect: false },
    ],
  },
  {
    prompt: 'What does HSS stand for in LTE/IMS architecture?',
    answers: [
      { text: 'Home Subscriber Server', isCorrect: true },
      { text: 'High-Speed Session Switch', isCorrect: false },
      { text: 'Handover Signalling System', isCorrect: false },
      { text: 'Hosted SIM Storage', isCorrect: false },
    ],
  },
  {
    prompt: 'In LTE architecture, what is the P-GW (PDN Gateway)?',
    answers: [
      { text: 'The anchor point for the UE\'s IP address, connecting to external data networks', isCorrect: true },
      { text: 'The gateway between the RAN and the EPC', isCorrect: false },
      { text: 'The node managing mobility between eNodeBs', isCorrect: false },
      { text: 'The interface between IMS and the PSTN', isCorrect: false },
    ],
  },
  {
    prompt: 'What does PCRF stand for in LTE?',
    answers: [
      { text: 'Policy and Charging Rules Function', isCorrect: true },
      { text: 'Packet Control and Routing Framework', isCorrect: false },
      { text: 'Physical Channel Resource Function', isCorrect: false },
      { text: 'Protocol Convergence and Routing Facility', isCorrect: false },
    ],
  },
  // ── 5G ───────────────────────────────────────────────────────────────────
  {
    prompt: 'What does NR stand for in "5G NR"?',
    answers: [
      { text: 'New Radio', isCorrect: true },
      { text: 'Network Routing', isCorrect: false },
      { text: 'Next-generation Radio', isCorrect: false },
      { text: 'Narrowband Radio', isCorrect: false },
    ],
  },
  {
    prompt: 'In a 5G Standalone (SA) core, which function replaces the LTE MME?',
    answers: [
      { text: 'AMF (Access and Mobility Management Function)', isCorrect: true },
      { text: 'SMF (Session Management Function)', isCorrect: false },
      { text: 'UPF (User Plane Function)', isCorrect: false },
      { text: 'PCF (Policy Control Function)', isCorrect: false },
    ],
  },
  {
    prompt: 'What does gNB refer to in 5G?',
    answers: [
      { text: 'The 5G base station (next-generation NodeB)', isCorrect: true },
      { text: 'A gateway node in the 5G backhaul', isCorrect: false },
      { text: 'The 5G core node managing mobility', isCorrect: false },
      { text: 'A 5G SIM profile management server', isCorrect: false },
    ],
  },
  {
    prompt: 'What does beamforming achieve in 5G radio?',
    answers: [
      { text: 'Directing radio energy towards specific users rather than broadcasting omnidirectionally', isCorrect: true },
      { text: 'Splitting a data stream across multiple frequency bands simultaneously', isCorrect: false },
      { text: 'Converting analogue voice signals into digital packets at the antenna', isCorrect: false },
      { text: 'Bundling multiple physical cells into a single logical cell for handover', isCorrect: false },
    ],
  },
  {
    prompt: 'What does MIMO stand for in wireless communications?',
    answers: [
      { text: 'Multiple Input Multiple Output', isCorrect: true },
      { text: 'Multiplexed IP Mobile Operations', isCorrect: false },
      { text: 'Managed Inter-cell Multi-path Output', isCorrect: false },
      { text: 'Mobile Integrated Media Orchestration', isCorrect: false },
    ],
  },
  // ── IMS & VoIP ────────────────────────────────────────────────────────────
  {
    prompt: 'What does IMS stand for?',
    answers: [
      { text: 'IP Multimedia Subsystem', isCorrect: true },
      { text: 'Integrated Messaging Service', isCorrect: false },
      { text: 'Internet Mobility Server', isCorrect: false },
      { text: 'Intelligent Monitoring System', isCorrect: false },
    ],
  },
  {
    prompt: 'In IMS, what is the role of the P-CSCF?',
    answers: [
      { text: 'Acts as the first SIP contact point for the UE, providing security and compression', isCorrect: true },
      { text: 'Handles subscriber registration in the home network', isCorrect: false },
      { text: 'Routes SIP messages between different IMS networks', isCorrect: false },
      { text: 'Manages charging data records for IMS services', isCorrect: false },
    ],
  },
  {
    prompt: 'What is VoLTE?',
    answers: [
      { text: 'Voice calls carried over the LTE data network using IMS', isCorrect: true },
      { text: 'A voice codec optimised for LTE bandwidth efficiency', isCorrect: false },
      { text: 'A method of roaming voice calls between LTE and 3G', isCorrect: false },
      { text: 'A voice encryption standard specific to 4G networks', isCorrect: false },
    ],
  },
  {
    prompt: 'What does a SIP REGISTER request accomplish?',
    answers: [
      { text: 'Binds a SIP URI to the user\'s current IP address at the registrar', isCorrect: true },
      { text: 'Initiates a new call session with a remote party', isCorrect: false },
      { text: 'Transfers an active call to a third party', isCorrect: false },
      { text: 'Subscribes to presence information from a contact', isCorrect: false },
    ],
  },
  {
    prompt: 'What does a SIP INVITE message initiate?',
    answers: [
      { text: 'A new call session or media negotiation with a remote party', isCorrect: true },
      { text: 'User registration with a SIP proxy', isCorrect: false },
      { text: 'A subscription to a notification event', isCorrect: false },
      { text: 'Graceful termination of an existing session', isCorrect: false },
    ],
  },
  {
    prompt: 'What is the purpose of RTCP alongside RTP?',
    answers: [
      { text: 'Provides quality feedback and statistics for an RTP media session', isCorrect: true },
      { text: 'Encrypts RTP media packets in transit', isCorrect: false },
      { text: 'Negotiates codec parameters before the session starts', isCorrect: false },
      { text: 'Retransmits lost RTP packets for reliability', isCorrect: false },
    ],
  },
  {
    prompt: 'What does SRTP provide over standard RTP?',
    answers: [
      { text: 'Encryption and message authentication for media streams', isCorrect: true },
      { text: 'Jitter buffering and reordering for voice packets', isCorrect: false },
      { text: 'Forward error correction for video streams', isCorrect: false },
      { text: 'QoS marking for real-time traffic at Layer 2', isCorrect: false },
    ],
  },
  {
    prompt: 'What does the DIAMETER protocol replace in 4G/5G networks?',
    answers: [
      { text: 'RADIUS — it is the AAA and policy protocol used in EPC and IMS', isCorrect: true },
      { text: 'SIP — it handles call setup and media negotiation in IMS', isCorrect: false },
      { text: 'GTP — it carries user data between gateways in the EPC', isCorrect: false },
      { text: 'BGP — it handles routing between operator core networks', isCorrect: false },
    ],
  },
  {
    prompt: 'What does SCTP (Stream Control Transmission Protocol) provide that TCP does not?',
    answers: [
      { text: 'Multi-homing and multi-streaming within a single association', isCorrect: true },
      { text: 'Lower latency through connectionless delivery', isCorrect: false },
      { text: 'Built-in encryption for all signalling traffic', isCorrect: false },
      { text: 'Per-packet QoS marking at Layer 4', isCorrect: false },
    ],
  },
  {
    prompt: 'What does ENUM do in VoIP networks?',
    answers: [
      { text: 'Maps a telephone number (E.164) to an internet resource such as a SIP URI via DNS', isCorrect: true },
      { text: 'Encrypts SIP signalling between carrier networks', isCorrect: false },
      { text: 'Converts analogue voice to PCM digital encoding', isCorrect: false },
      { text: 'Allocates number ranges to operators from a national registry', isCorrect: false },
    ],
  },
  // ── PSTN / fixed voice ────────────────────────────────────────────────────
  {
    prompt: 'What is a PBX (Private Branch Exchange)?',
    answers: [
      { text: 'A private telephone switch that manages internal and external calls within an organisation', isCorrect: true },
      { text: 'A mobile base station for enterprise campuses', isCorrect: false },
      { text: 'A billing system for corporate phone accounts', isCorrect: false },
      { text: 'A type of SIP trunk between two carrier networks', isCorrect: false },
    ],
  },
  {
    prompt: 'What does PSTN stand for?',
    answers: [
      { text: 'Public Switched Telephone Network', isCorrect: true },
      { text: 'Private Secure Transmission Network', isCorrect: false },
      { text: 'Packet-Switched Telecommunications Node', isCorrect: false },
      { text: 'Public Subscriber Terminal Node', isCorrect: false },
    ],
  },
  {
    prompt: 'What is ISDN (Integrated Services Digital Network)?',
    answers: [
      { text: 'A set of standards for digital transmission of voice and data over ordinary telephone copper lines', isCorrect: true },
      { text: 'An early packet-switched data network predating the internet', isCorrect: false },
      { text: 'A satellite-based global telephone system', isCorrect: false },
      { text: 'A digital compression standard for GSM voice', isCorrect: false },
    ],
  },
  {
    prompt: 'In telephony, what is a "trunk"?',
    answers: [
      { text: 'A communications channel between two switching nodes, typically carrying multiple calls', isCorrect: true },
      { text: 'A physical cable connecting a handset to a wall socket', isCorrect: false },
      { text: 'A type of SIP server that bridges two carrier networks', isCorrect: false },
      { text: 'A signalling path between an HLR and a VLR in GSM', isCorrect: false },
    ],
  },
  {
    prompt: 'What does a T1 line provide in North American telecom?',
    answers: [
      { text: '24 DS0 channels at a total line rate of 1.544 Mbit/s', isCorrect: true },
      { text: 'A 10 Gbit/s fibre optic link between exchanges', isCorrect: false },
      { text: 'A 64 kbit/s ISDN basic rate channel', isCorrect: false },
      { text: 'A coaxial cable standard used for cable TV distribution', isCorrect: false },
    ],
  },
  {
    prompt: 'What does an E1 circuit provide in European telecom?',
    answers: [
      { text: '30 bearer channels plus 2 signalling/framing channels at 2.048 Mbit/s', isCorrect: true },
      { text: '24 voice channels at 1.544 Mbit/s', isCorrect: false },
      { text: 'A 10 Gbit/s DWDM optical link', isCorrect: false },
      { text: 'A 64 kbit/s ISDN basic rate channel', isCorrect: false },
    ],
  },
  {
    prompt: 'What distinguishes a Class 5 switch from a Class 4 switch in the PSTN?',
    answers: [
      { text: 'Class 5 connects directly to end-user lines; Class 4 is a transit switch between offices', isCorrect: true },
      { text: 'Class 5 handles international calls; Class 4 handles domestic calls only', isCorrect: false },
      { text: 'Class 5 is packet-switched; Class 4 is circuit-switched', isCorrect: false },
      { text: 'Class 5 supports ISDN; Class 4 supports analogue only', isCorrect: false },
    ],
  },
  {
    prompt: 'What is a softswitch?',
    answers: [
      { text: 'A software-based call control element that replaces traditional hardware circuit-switched exchanges', isCorrect: true },
      { text: 'A physical switch designed for low-power small cell deployments', isCorrect: false },
      { text: 'An application for managing SIM card provisioning remotely', isCorrect: false },
      { text: 'A software library for building IVR applications', isCorrect: false },
    ],
  },
  {
    prompt: 'What does IVR (Interactive Voice Response) do?',
    answers: [
      { text: 'Allows callers to interact with a phone system using voice or keypad input to route calls or retrieve information', isCorrect: true },
      { text: 'Encrypts voicemail messages at rest', isCorrect: false },
      { text: 'Handles billing disputes between carriers automatically', isCorrect: false },
      { text: 'Converts SIP calls to SS7 for PSTN termination', isCorrect: false },
    ],
  },
  // ── IP transport & routing ─────────────────────────────────────────────────
  {
    prompt: 'What is MPLS (Multi-Protocol Label Switching)?',
    answers: [
      { text: 'A data forwarding technique using short labels to make high-speed routing decisions', isCorrect: true },
      { text: 'A protocol for encrypting traffic between carrier routers', isCorrect: false },
      { text: 'A method of aggregating DSL subscriber lines at the exchange', isCorrect: false },
      { text: 'A version of IP designed specifically for real-time voice traffic', isCorrect: false },
    ],
  },
  {
    prompt: 'What is the primary purpose of BGP (Border Gateway Protocol)?',
    answers: [
      { text: 'Exchanging routing information between autonomous systems on the internet', isCorrect: true },
      { text: 'Routing packets within a single carrier\'s internal network', isCorrect: false },
      { text: 'Assigning IP addresses to subscribers dynamically', isCorrect: false },
      { text: 'Carrying SS7 signalling between telecom switches', isCorrect: false },
    ],
  },
  {
    prompt: 'What is OSPF used for in telecom networks?',
    answers: [
      { text: 'Interior gateway routing — finding optimal paths within a single network domain', isCorrect: true },
      { text: 'Exchanging routes between different operators\' networks', isCorrect: false },
      { text: 'Assigning DNS names to IP addresses within the core', isCorrect: false },
      { text: 'Carrying voice signalling between MSCs', isCorrect: false },
    ],
  },
  {
    prompt: 'What does DSCP (Differentiated Services Code Point) enable?',
    answers: [
      { text: 'Per-hop traffic prioritisation at the IP layer for QoS', isCorrect: true },
      { text: 'Encrypting IP headers between carrier routers', isCorrect: false },
      { text: 'Splitting a flow across multiple network paths', isCorrect: false },
      { text: 'Assigning static IP addresses to subscribers', isCorrect: false },
    ],
  },
  {
    prompt: 'What does DWDM (Dense Wavelength Division Multiplexing) enable?',
    answers: [
      { text: 'Carrying many independent optical channels on a single fibre by using different wavelengths', isCorrect: true },
      { text: 'Dynamic wireless channel assignment in LTE networks', isCorrect: false },
      { text: 'Compressing multiple voice streams into a single DS0 timeslot', isCorrect: false },
      { text: 'Distributing Wi-Fi traffic across multiple access points', isCorrect: false },
    ],
  },
  // ── Fixed broadband ───────────────────────────────────────────────────────
  {
    prompt: 'What is a DSLAM?',
    answers: [
      { text: 'Digital Subscriber Line Access Multiplexer — aggregates multiple DSL subscriber lines at the exchange', isCorrect: true },
      { text: 'Direct Satellite Link Access Module', isCorrect: false },
      { text: 'Digital Signalling Layer for Access Management', isCorrect: false },
      { text: 'Dynamic Spectrum Lease and Allocation Manager', isCorrect: false },
    ],
  },
  {
    prompt: 'What does FTTP stand for?',
    answers: [
      { text: 'Fibre to the Premises — fibre running all the way to the customer\'s building', isCorrect: true },
      { text: 'Fast Transport and Transfer Protocol', isCorrect: false },
      { text: 'Fibre Trunking and Transit Point', isCorrect: false },
      { text: 'Fixed Telephony Transit Protocol', isCorrect: false },
    ],
  },
  {
    prompt: 'What is the difference between FTTC and FTTP?',
    answers: [
      { text: 'FTTC runs fibre to a street cabinet with copper for the last section; FTTP runs fibre all the way to the premises', isCorrect: true },
      { text: 'FTTC is for commercial buildings only; FTTP is for residential customers', isCorrect: false },
      { text: 'FTTC uses GPON technology; FTTP uses DOCSIS', isCorrect: false },
      { text: 'FTTC supports up to 1 Gbit/s; FTTP is limited to 100 Mbit/s', isCorrect: false },
    ],
  },
  {
    prompt: 'What is GPON (Gigabit Passive Optical Network)?',
    answers: [
      { text: 'A fibre access technology using passive splitters to share a single upstream fibre among multiple premises', isCorrect: true },
      { text: 'A GSM protocol for packet data optimisation', isCorrect: false },
      { text: 'A type of active repeater used in submarine cables', isCorrect: false },
      { text: 'A standard for 10 Gbit/s backhaul between base stations', isCorrect: false },
    ],
  },
  // ── RAN & infrastructure ───────────────────────────────────────────────────
  {
    prompt: 'What does RAN stand for?',
    answers: [
      { text: 'Radio Access Network — the part of the network connecting end-user devices to the core', isCorrect: true },
      { text: 'Roaming Access Node', isCorrect: false },
      { text: 'Routing and Addressing Node', isCorrect: false },
      { text: 'Remote Antenna Network', isCorrect: false },
    ],
  },
  {
    prompt: 'What is O-RAN (Open RAN)?',
    answers: [
      { text: 'An industry initiative to disaggregate and open RAN interfaces so components from multiple vendors can interoperate', isCorrect: true },
      { text: 'An omnidirectional antenna standard for macro cells', isCorrect: false },
      { text: 'An optical transport protocol for RAN fronthaul links', isCorrect: false },
      { text: 'An open-source operating system for base stations', isCorrect: false },
    ],
  },
  {
    prompt: 'What is the fronthaul in a disaggregated RAN architecture?',
    answers: [
      { text: 'The link between the Radio Unit (RU) and the Distributed Unit (DU)', isCorrect: true },
      { text: 'The connection between the core network and the RAN controller', isCorrect: false },
      { text: 'The fibre link between two macro cell tower sites', isCorrect: false },
      { text: 'The backhaul between the RAN and an internet exchange', isCorrect: false },
    ],
  },
  {
    prompt: 'What is a small cell in mobile networks?',
    answers: [
      { text: 'A low-power base station used to enhance coverage or capacity in dense areas', isCorrect: true },
      { text: 'A miniature SIM card format used in IoT devices', isCorrect: false },
      { text: 'A network slice configured for low-latency services', isCorrect: false },
      { text: 'A type of in-building copper distribution solution', isCorrect: false },
    ],
  },
  {
    prompt: 'What is a femtocell?',
    answers: [
      { text: 'A very small, low-power cellular base station designed for home or small office use', isCorrect: true },
      { text: 'A 5G antenna for very high frequency (mmWave) outdoor deployments', isCorrect: false },
      { text: 'A type of network slice for dense urban environments', isCorrect: false },
      { text: 'A passive signal repeater for extending indoor coverage', isCorrect: false },
    ],
  },
  {
    prompt: 'What is SON (Self-Organizing Network)?',
    answers: [
      { text: 'Automated RAN management that self-configures, self-optimises, and self-heals base stations', isCorrect: true },
      { text: 'A network slicing architecture specific to 5G SA deployments', isCorrect: false },
      { text: 'A distributed DNS system for carrier-grade IP networks', isCorrect: false },
      { text: 'An ONAP plugin for managing virtualised network functions', isCorrect: false },
    ],
  },
  // ── Core network components ────────────────────────────────────────────────
  {
    prompt: 'What does the VLR (Visitor Location Register) do?',
    answers: [
      { text: 'Temporarily stores data about subscribers currently active in a given MSC\'s coverage area', isCorrect: true },
      { text: 'Maintains the permanent subscriber database for the home network', isCorrect: false },
      { text: 'Routes voice calls between different operators\' networks', isCorrect: false },
      { text: 'Manages IP address allocation in the EPC', isCorrect: false },
    ],
  },
  {
    prompt: 'What is an MSRN (Mobile Station Roaming Number)?',
    answers: [
      { text: 'A temporary directory number assigned to route an incoming call to the subscriber via the VLR', isCorrect: true },
      { text: 'The number stored on the SIM identifying the home network operator', isCorrect: false },
      { text: 'A secondary phone number assigned during international roaming', isCorrect: false },
      { text: 'The routing number used in SS7 to deliver SMS messages', isCorrect: false },
    ],
  },
  {
    prompt: 'What is a media gateway in a VoIP network?',
    answers: [
      { text: 'A device that converts between circuit-switched (TDM) and packet-switched (IP) media', isCorrect: true },
      { text: 'A proxy server that forwards SIP signalling between domains', isCorrect: false },
      { text: 'A device that monitors RTP streams for quality metrics', isCorrect: false },
      { text: 'A switch that aggregates multiple SIP trunks from different carriers', isCorrect: false },
    ],
  },
  {
    prompt: 'What does SMSC stand for?',
    answers: [
      { text: 'Short Message Service Centre — stores and forwards SMS messages', isCorrect: true },
      { text: 'Subscriber Management and Service Controller', isCorrect: false },
      { text: 'Session Management and Signalling Core', isCorrect: false },
      { text: 'Secure Mobile Session Controller', isCorrect: false },
    ],
  },
  // ── Charging & BSS/OSS ────────────────────────────────────────────────────
  {
    prompt: 'What is the purpose of the OCS (Online Charging System)?',
    answers: [
      { text: 'Real-time balance management and credit control for prepaid and post-paid subscribers', isCorrect: true },
      { text: 'Managing the assignment of telephone numbers to subscribers', isCorrect: false },
      { text: 'Storing subscriber profile data for roaming queries', isCorrect: false },
      { text: 'Monitoring network performance and generating alarms', isCorrect: false },
    ],
  },
  {
    prompt: 'What does an OFCS (Offline Charging System) do?',
    answers: [
      { text: 'Collects CDRs and processes them in batch for post-paid billing', isCorrect: true },
      { text: 'Provides real-time credit control for prepaid users', isCorrect: false },
      { text: 'Manages roaming settlement between operators', isCorrect: false },
      { text: 'Monitors voice quality metrics for regulatory reporting', isCorrect: false },
    ],
  },
  {
    prompt: 'What is a BSS (Business Support System) in telecom?',
    answers: [
      { text: 'Systems handling customer-facing operations: billing, CRM, and order management', isCorrect: true },
      { text: 'The Base Station Subsystem — the radio infrastructure in GSM', isCorrect: false },
      { text: 'Software for configuring and monitoring base station parameters', isCorrect: false },
      { text: 'The back-end database storing subscriber SIM profiles', isCorrect: false },
    ],
  },
  {
    prompt: 'What is an OSS (Operations Support System)?',
    answers: [
      { text: 'Systems managing network operations: provisioning, monitoring, and fault management', isCorrect: true },
      { text: 'Customer billing and account management software', isCorrect: false },
      { text: 'A system for processing online payments for prepaid top-ups', isCorrect: false },
      { text: 'An orchestration layer sitting above SDN controllers', isCorrect: false },
    ],
  },
  {
    prompt: 'What does ARPU stand for?',
    answers: [
      { text: 'Average Revenue Per User — a key financial KPI for telecom operators', isCorrect: true },
      { text: 'Automatic Radio Parameter Update', isCorrect: false },
      { text: 'Advanced Roaming Protocol Unit', isCorrect: false },
      { text: 'Aggregate Radio Performance Unit', isCorrect: false },
    ],
  },
  {
    prompt: 'What is "churn" in the telecom industry?',
    answers: [
      { text: 'The rate at which subscribers cancel and leave an operator\'s service', isCorrect: true },
      { text: 'Network congestion caused by sudden spikes in traffic demand', isCorrect: false },
      { text: 'Signal degradation due to interference between adjacent cells', isCorrect: false },
      { text: 'Billing errors caused by mis-rated call records', isCorrect: false },
    ],
  },
  // ── Roaming & industry bodies ──────────────────────────────────────────────
  {
    prompt: 'What does "roaming" mean for a mobile subscriber?',
    answers: [
      { text: 'Using a visited network outside the home operator\'s coverage area while the account remains with the home operator', isCorrect: true },
      { text: 'Switching between Wi-Fi and mobile data on the same device', isCorrect: false },
      { text: 'Moving between frequency bands within a single operator\'s network', isCorrect: false },
      { text: 'Automatically selecting the strongest antenna sector within a cell', isCorrect: false },
    ],
  },
  {
    prompt: 'What is an MVNO (Mobile Virtual Network Operator)?',
    answers: [
      { text: 'A company that resells mobile services using another operator\'s network infrastructure', isCorrect: true },
      { text: 'An operator that owns spectrum but leases tower sites from another company', isCorrect: false },
      { text: 'A wholesale carrier offering SIP trunking to enterprises', isCorrect: false },
      { text: 'A government body that manages mobile frequency spectrum auctions', isCorrect: false },
    ],
  },
  {
    prompt: 'What is the difference between an MVNO and an MVNE?',
    answers: [
      { text: 'An MVNE provides platforms and infrastructure to MVNOs; an MVNO sells services to end customers', isCorrect: true },
      { text: 'An MVNO owns the core network; an MVNE owns the radio access network', isCorrect: false },
      { text: 'An MVNE is a consumer brand; an MVNO is a wholesale brand', isCorrect: false },
      { text: 'There is no difference — the terms are used interchangeably', isCorrect: false },
    ],
  },
  {
    prompt: 'What does GSMA TAP (Transferred Account Procedure) define?',
    answers: [
      { text: 'The file format and process for exchanging roaming usage records between operators for settlement', isCorrect: true },
      { text: 'A security protocol for transferring SIM profiles over the air', isCorrect: false },
      { text: 'The standard procedure for porting numbers between operators', isCorrect: false },
      { text: 'A settlement process specifically for wholesale SMS interconnect', isCorrect: false },
    ],
  },
  {
    prompt: 'What is IR.21 in the GSMA roaming framework?',
    answers: [
      { text: 'A document each operator publishes describing its network capabilities to roaming partners', isCorrect: true },
      { text: 'The GSMA standard for inter-operator SIP interconnect', isCorrect: false },
      { text: 'The specification for SMS roaming in 4G networks', isCorrect: false },
      { text: 'A fraud management protocol for roaming scenarios', isCorrect: false },
    ],
  },
  {
    prompt: 'What does GSMA stand for?',
    answers: [
      { text: 'GSM Association — the global industry body representing mobile network operators', isCorrect: true },
      { text: 'Global Spectrum Management Authority', isCorrect: false },
      { text: 'GSM Manufacturers Alliance', isCorrect: false },
      { text: 'Global Subscriber Management API', isCorrect: false },
    ],
  },
  {
    prompt: 'What is 3GPP?',
    answers: [
      { text: 'The technical standards body that develops specifications for mobile networks (GSM, UMTS, LTE, 5G)', isCorrect: true },
      { text: 'A global billing protocol for inter-carrier settlements', isCorrect: false },
      { text: 'An EU regulatory framework for spectrum allocation', isCorrect: false },
      { text: 'A certification body for testing mobile handsets', isCorrect: false },
    ],
  },
  {
    prompt: 'What does the ITU (International Telecommunication Union) do?',
    answers: [
      { text: 'Coordinates global telecommunications standards and spectrum allocation between countries', isCorrect: true },
      { text: 'Regulates telecom operators exclusively within the European Union', isCorrect: false },
      { text: 'Manages the assignment of telephone number ranges to operators', isCorrect: false },
      { text: 'Develops internet security standards on behalf of IETF', isCorrect: false },
    ],
  },
  {
    prompt: 'What is ETSI?',
    answers: [
      { text: 'European Telecommunications Standards Institute — produces ICT standards including telecom', isCorrect: true },
      { text: 'European Telecom Services Integration — an EU billing clearinghouse', isCorrect: false },
      { text: 'Enhanced Transmission and Signalling Interface', isCorrect: false },
      { text: 'European Telecom Safety Inspector', isCorrect: false },
    ],
  },
  // ── IoT & emerging tech ────────────────────────────────────────────────────
  {
    prompt: 'What does NB-IoT (Narrowband IoT) optimise for?',
    answers: [
      { text: 'Low power consumption and deep indoor coverage for low-data-rate IoT devices', isCorrect: true },
      { text: 'High-bandwidth video streaming from IoT cameras', isCorrect: false },
      { text: 'Ultra-low latency for industrial control systems', isCorrect: false },
      { text: 'High-density Wi-Fi offload for smart home networks', isCorrect: false },
    ],
  },
  {
    prompt: 'What is the main difference between NB-IoT and LTE-M (Cat-M1)?',
    answers: [
      { text: 'LTE-M supports voice, higher data rates, and handover; NB-IoT is simpler with lower data rates and cost', isCorrect: true },
      { text: 'NB-IoT uses licensed spectrum; LTE-M uses unlicensed ISM bands', isCorrect: false },
      { text: 'LTE-M only works indoors; NB-IoT is designed for outdoor deployments', isCorrect: false },
      { text: 'There is no practical difference — they target identical use cases', isCorrect: false },
    ],
  },
  {
    prompt: 'What does V2X (Vehicle-to-Everything) communications enable?',
    answers: [
      { text: 'Vehicles communicating with other vehicles, road infrastructure, and pedestrians', isCorrect: true },
      { text: 'A satellite navigation system used in autonomous vehicles', isCorrect: false },
      { text: 'A 5G network slice designed for low-latency in-vehicle video streaming', isCorrect: false },
      { text: 'A vehicle fleet management API standard', isCorrect: false },
    ],
  },
  {
    prompt: 'What is an eSIM?',
    answers: [
      { text: 'An embedded SIM soldered into the device that can be remotely provisioned with operator profiles', isCorrect: true },
      { text: 'A SIM card with expanded memory for storing contacts and media', isCorrect: false },
      { text: 'A virtual SIM that works over Wi-Fi without any physical card', isCorrect: false },
      { text: 'A SIM form factor smaller than Nano-SIM designed for wearables', isCorrect: false },
    ],
  },
  // ── Virtualisation ────────────────────────────────────────────────────────
  {
    prompt: 'What does NFV (Network Function Virtualisation) achieve?',
    answers: [
      { text: 'Running traditional dedicated hardware network appliances as software on standard servers', isCorrect: true },
      { text: 'Creating encrypted virtual private networks for enterprise customers', isCorrect: false },
      { text: 'Virtualising the radio interface to support multiple frequency bands simultaneously', isCorrect: false },
      { text: 'Dynamically assigning IP addresses to virtual machines in the cloud', isCorrect: false },
    ],
  },
  {
    prompt: 'What is SDN (Software Defined Networking)?',
    answers: [
      { text: 'Separating the network control plane from the data plane, enabling centralised programmable control', isCorrect: true },
      { text: 'Encrypting all traffic between network devices using software agents', isCorrect: false },
      { text: 'Running multiple virtual networks on shared physical infrastructure', isCorrect: false },
      { text: 'A protocol for zero-touch provisioning of routers', isCorrect: false },
    ],
  },
  {
    prompt: 'What does MANO stand for in NFV architecture?',
    answers: [
      { text: 'Management and Network Orchestration', isCorrect: true },
      { text: 'Mobile Aggregation and Network Offload', isCorrect: false },
      { text: 'Multi-Access Network Operations', isCorrect: false },
      { text: 'Management of Analogue and Narrowband Objects', isCorrect: false },
    ],
  },
  {
    prompt: 'What is Multi-access Edge Computing (MEC)?',
    answers: [
      { text: 'Moving compute and storage to the edge of the RAN to reduce latency for applications', isCorrect: true },
      { text: 'Connecting multiple Wi-Fi access points to a single centralised controller', isCorrect: false },
      { text: 'Aggregating multiple physical links between routers for higher throughput', isCorrect: false },
      { text: 'Cloud computing distributed across multiple geographically separated data centres', isCorrect: false },
    ],
  },
  // ── Subscriber services ───────────────────────────────────────────────────
  {
    prompt: 'What does VAS stand for in telecom?',
    answers: [
      { text: 'Value Added Services — services beyond core voice and data, such as messaging or streaming', isCorrect: true },
      { text: 'Voice Aggregation Switch', isCorrect: false },
      { text: 'Virtual Access Server', isCorrect: false },
      { text: 'Verified Authentication Service', isCorrect: false },
    ],
  },
  {
    prompt: 'What is CAMEL (Customised Applications for Mobile networks Enhanced Logic)?',
    answers: [
      { text: 'An Intelligent Network framework enabling prepaid and roaming services controlled by home network logic', isCorrect: true },
      { text: 'A voice compression standard used in 2G networks', isCorrect: false },
      { text: 'A charging interface between the PCRF and the OCS', isCorrect: false },
      { text: 'An API for third-party VAS integration with operator core networks', isCorrect: false },
    ],
  },
  {
    prompt: 'What is a USSD (Unstructured Supplementary Service Data) session?',
    answers: [
      { text: 'A real-time text session between a mobile device and a network application, often used for balance checks', isCorrect: true },
      { text: 'An encrypted SMS used for SIM OTA provisioning', isCorrect: false },
      { text: 'A session for downloading apps over a 2G connection', isCorrect: false },
      { text: 'A voice call that uses a data channel instead of a voice bearer', isCorrect: false },
    ],
  },
  {
    prompt: 'What does OTA (Over-The-Air) provisioning do in mobile?',
    answers: [
      { text: 'Remotely updates SIM card settings, software, or configuration without physical access', isCorrect: true },
      { text: 'Improves signal reception by adjusting antenna tilt parameters remotely', isCorrect: false },
      { text: 'Transfers call records to a charging server wirelessly', isCorrect: false },
      { text: 'Provisions an IP address to the UE during data session setup', isCorrect: false },
    ],
  },
  {
    prompt: 'What does "spectrum refarming" mean in telecom?',
    answers: [
      { text: 'Reallocating a frequency band previously used for one technology (e.g. 2G) to a newer one (e.g. 4G/5G)', isCorrect: true },
      { text: 'Auctioning new spectrum licences to new market entrants', isCorrect: false },
      { text: 'Returning unused spectrum licences to the national regulator', isCorrect: false },
      { text: 'Sharing spectrum between two operators under a bilateral agreement', isCorrect: false },
    ],
  },
  {
    prompt: 'What is VoNR (Voice over New Radio)?',
    answers: [
      { text: 'Voice calls delivered natively over the 5G NR radio and 5G SA core using IMS', isCorrect: true },
      { text: 'A proprietary voice compression technology for 5G handsets', isCorrect: false },
      { text: 'An enhanced version of VoLTE that uses 5G frequencies for data bearers', isCorrect: false },
      { text: 'A voice call fallback mechanism that drops from 5G to 4G when needed', isCorrect: false },
    ],
  },
  {
    prompt: 'What does OAM stand for in telecom network management?',
    answers: [
      { text: 'Operations, Administration and Maintenance', isCorrect: true },
      { text: 'Open Access Management', isCorrect: false },
      { text: 'Optical Amplifier Module', isCorrect: false },
      { text: 'Online Account Management', isCorrect: false },
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
