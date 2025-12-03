/**
 * Comprehensive Indian Cities Database Generator
 * Generates 800+ cities with state and RTO mapping
 * Sources: Census data, district headquarters, major towns
 */

const fs = require('fs');
const path = require('path');

// Comprehensive list of Indian cities by state
// This includes all district headquarters + major cities + tier 1/2/3 cities
const CITIES_BY_STATE = {
    'Maharashtra': {
        rtoState: 'MAHARASHTRA',
        cities: [
            // Tier 1
            'Mumbai', 'Pune', 'Nagpur', 'Thane', 'Pimpri-Chinchwad', 'Nashik', 'Navi Mumbai',
            // Tier 2  
            'Aurangabad', 'Solapur', 'Kolhapur', 'Nanded', 'Akola', 'Jalgaon', 'Malegaon',
            'Amravati', 'Bhiwandi', 'Sangli', 'Ichalkaranji', 'Ahmadnagar', 'Yavatmal',
            'Chandrapur', 'Dhule', 'Latur', 'Parbhani', 'Wardha', 'Ratnagiri',
            // Tier 3 & District HQs
            'Satara', 'Jalna', 'Beed', 'Osmanabad', 'Buldhana', 'Washim', 'Hingoli',
            'Gondia', 'Bhandara', 'Gadchiroli', 'Sindhudurg', 'Raigad', 'Alibag',
            'Panvel', 'Kalyan', 'Dombivli', 'Vasai', 'Virar', 'Ulhasnagar', 'Ambarnath',
            'Badlapur', 'Mira-Bhayandar', 'Bhusawal', 'Palghar', 'Baramati', 'Shirdi',
            'Lonavala', 'Khandala', 'Mahabaleshwar', 'Panchgani', 'Alibag', 'Murud',
            'Vengurla', 'Malvan', 'Sawantwadi', 'Kudal', 'Kankavli', 'Chiplun',
            'Mahad', 'Pen', 'Karjat', 'Khopoli', 'Talegaon', 'Dehu Road', 'Khadki',
            'Shivaji Nagar', 'Hadapsar', 'Wakad', 'Hinjewadi', 'Magarpatta', 'Kharadi',
            'Viman Nagar', 'Koregaon Park', 'Baner', 'Aundh', 'Kothrud', 'Warje',
            'Katraj', 'Sinhagad Road', 'Kondhwa', 'Undri', 'Manjri', 'Wagholi'
        ]
    },
    'Delhi': {
        rtoState: 'THE GOV OF NCT OF DELHI (UT)',
        cities: [
            'Delhi', 'New Delhi', 'Central Delhi', 'North Delhi', 'South Delhi',
            'East Delhi', 'West Delhi', 'North East Delhi', 'North West Delhi',
            'South West Delhi', 'South East Delhi', 'Shahdara', 'Dwarka',
            'Rohini', 'Pitampura', 'Janakpuri', 'Laxmi Nagar', 'Mayur Vihar',
            'Vasant Kunj', 'Saket', 'Hauz Khas', 'Greater Kailash', 'Defence Colony',
            'Connaught Place', 'Karol Bagh', 'Chandni Chowk', 'Paharganj'
        ]
    },
    'Karnataka': {
        rtoState: 'KARNATAKA',
        cities: [
            // Tier 1
            'Bangalore', 'Bengaluru', 'Mysore', 'Mysuru', 'Mangalore', 'Hubli', 'Belgaum',
            // Tier 2
            'Gulbarga', 'Davanagere', 'Bellary', 'Bijapur', 'Shimoga', 'Tumkur',
            'Raichur', 'Hassan', 'Udupi', 'Shivamogga',
            // District HQs & Major Towns
            'Dharwad', 'Bagalkot', 'Gadag', 'Haveri', 'Chitradurga', 'Chikmagalur',
            'Mandya', 'Kolar', 'Chikballapur', 'Ramanagara', 'Chamarajanagar',
            'Kodagu', 'Madikeri', 'Yadgir', 'Koppal', 'Ballari', 'Vijayapura',
            'Kalaburagi', 'Belagavi', 'Uttara Kannada', 'Karwar', 'Sirsi',
            'Bhatkal', 'Kundapura', 'Manipal', 'Puttur', 'Sullia', 'Bantwal',
            'Moodabidri', 'Karkala', 'Sringeri', 'Thirthahalli', 'Bhadravati',
            'Sagar', 'Hosanagar', 'Soraba', 'Honnavar', 'Kumta', 'Ankola',
            'Joida', 'Dandeli', 'Haliyal', 'Yellapur', 'Mundgod', 'Siddapur'
        ]
    },
    'Tamil Nadu': {
        rtoState: 'TAMIL NADU',
        cities: [
            // Tier 1
            'Chennai', 'Coimbatore', 'Madurai', 'Tiruchirappalli', 'Salem', 'Tiruppur',
            'Erode', 'Tirunelveli', 'Vellore', 'Thanjavur',
            // Tier 2 & 3
            'Dindigul', 'Cuddalore', 'Kanchipuram', 'Karur', 'Thoothukudi',
            'Nagercoil', 'Kumbakonam', 'Tiruvannamalai', 'Pollachi', 'Rajapalayam',
            'Sivakasi', 'Pudukkottai', 'Neyveli', 'Nagapattinam', 'Viluppuram',
            'Tiruvallur', 'Kancheepuram', 'Chengalpattu', 'Ranipet', 'Tirupathur',
            'Krishnagiri', 'Dharmapuri', 'Namakkal', 'Perambalur', 'Ariyalur',
            'Kallakurichi', 'Mayiladuthurai', 'Tenkasi', 'Theni', 'Virudhunagar',
            'Ramanathapuram', 'Sivaganga', 'Karaikudi', 'Paramakudi', 'Devakottai',
            'Manamadurai', 'Ilayangudi', 'Tiruchendur', 'Kovilpatti', 'Sankarankovil',
            'Ambasamudram', 'Cheranmahadevi', 'Nanguneri', 'Palayamkottai', 'Tuticorin',
            'Kayalpattinam', 'Eral', 'Sathankulam', 'Tiruvottiyur', 'Ambattur',
            'Avadi', 'Tambaram', 'Pallavaram', 'Chromepet', 'Guindy', 'Adyar',
            'Velachery', 'Porur', 'Anna Nagar', 'T Nagar', 'Mylapore', 'Triplicane'
        ]
    },
    'Uttar Pradesh': {
        rtoState: 'UTTAR PRADESH',
        cities: [
            // Tier 1
            'Lucknow', 'Kanpur', 'Ghaziabad', 'Agra', 'Meerut', 'Varanasi', 'Allahabad',
            'Prayagraj', 'Bareilly', 'Aligarh', 'Moradabad', 'Saharanpur', 'Gorakhpur',
            'Noida', 'Greater Noida',
            // Tier 2
            'Firozabad', 'Jhansi', 'Muzaffarnagar', 'Mathura', 'Shahjahanpur',
            'Rampur', 'Farrukhabad', 'Hapur', 'Etawah', 'Bulandshahr', 'Sambhal',
            // District HQs & Major Towns
            'Ayodhya', 'Faizabad', 'Azamgarh', 'Bahraich', 'Ballia', 'Balrampur',
            'Banda', 'Barabanki', 'Basti', 'Bijnor', 'Budaun', 'Chandauli',
            'Chitrakoot', 'Deoria', 'Etah', 'Fatehpur', 'Gautam Buddha Nagar',
            'Gonda', 'Hamirpur', 'Hardoi', 'Hathras', 'Jalaun', 'Jaunpur',
            'Kannauj', 'Kanpur Dehat', 'Kasganj', 'Kaushambi', 'Kheri', 'Kushinagar',
            'Lalitpur', 'Maharajganj', 'Mahoba', 'Mainpuri', 'Mau', 'Mirzapur',
            'Orai', 'Pilibhit', 'Pratapgarh', 'Raebareli', 'Shamli', 'Shravasti',
            'Siddharthnagar', 'Sitapur', 'Sonbhadra', 'Sultanpur', 'Unnao',
            'Amethi', 'Bagpat', 'Amroha', 'Sambhal', 'Hapur', 'Shamli'
        ]
    },
    'West Bengal': {
        rtoState: 'WEST BENGAL',
        cities: [
            // Tier 1
            'Kolkata', 'Howrah', 'Durgapur', 'Asansol', 'Siliguri',
            // Tier 2 & 3
            'Bardhaman', 'Barddhaman', 'Kharagpur', 'Haldia', 'Rajarhat', 'New Town',
            'Barasat', 'Barrackpore', 'Bhatpara', 'Panihati', 'Kamarhati', 'Dum Dum',
            'Raiganj', 'Jalpaiguri', 'Malda', 'Krishnanagar', 'Nabadwip', 'Ranaghat',
            'Shantipur', 'Berhampore', 'Murshidabad', 'Jangipur', 'Domkal', 'Lalgola',
            'Raghunathganj', 'Suri', 'Bolpur', 'Rampurhat', 'Sainthia', 'Katwa',
            'Kalna', 'Memari', 'Dainhat', 'Kulti', 'Raniganj', 'Bankura', 'Bishnupur',
            'Khatra', 'Sonamukhi', 'Purulia', 'Raghunathpur', 'Jhalda', 'Arambagh',
            'Tamluk', 'Contai', 'Egra', 'Haldia', 'Panskura', 'Kolaghat', 'Mecheda',
            'Nandakumar', 'Mahishadal', 'Kakdwip', 'Namkhana', 'Sagar', 'Patharpratima',
            'Kulpi', 'Mathurapur', 'Diamond Harbour', 'Falta', 'Budge Budge',
            'Pujali', 'Sonarpur', 'Naihati', 'Halisahar', 'Kanchrapara', 'Habra',
            'Basirhat', 'Bangaon', 'Bongaon', 'Hasnabad', 'Taki', 'Sandeshkhali'
        ]
    },
    'Gujarat': {
        rtoState: 'GUJARAT',
        cities: [
            // Tier 1
            'Ahmedabad', 'Surat', 'Vadodara', 'Rajkot', 'Bhavnagar', 'Jamnagar',
            // Tier 2 & 3
            'Junagadh', 'Gandhidham', 'Anand', 'Nadiad', 'Morbi', 'Surendranagar',
            'Bharuch', 'Vapi', 'Navsari', 'Veraval', 'Porbandar', 'Godhra',
            'Bhuj', 'Ankleshwar', 'Botad', 'Amreli', 'Deesa', 'Jetpur',
            'Gondal', 'Palanpur', 'Valsad', 'Patan', 'Mehsana', 'Modasa',
            'Himmatnagar', 'Dahod', 'Dahanu', 'Dholka', 'Kalol', 'Khambhat',
            'Mahuva', 'Keshod', 'Wadhwan', 'Anjar', 'Mandvi', 'Mundra',
            'Dwarka', 'Okha', 'Jodiya', 'Khambhalia', 'Upleta', 'Dhoraji',
            'Paddhari', 'Wankaner', 'Tankara', 'Jasdan', 'Chotila', 'Dhrangadhra',
            'Halvad', 'Limbdi', 'Thangadh', 'Viramgam', 'Sanand', 'Bavla',
            'Dhandhuka', 'Dhanera', 'Tharad', 'Vadgam', 'Kadi', 'Vijapur',
            'Visnagar', 'Unjha', 'Sidhpur', 'Chanasma', 'Harij', 'Sami'
        ]
    },
    'Rajasthan': {
        rtoState: 'RAJASTHAN',
        cities: [
            // Tier 1
            'Jaipur', 'Jodhpur', 'Kota', 'Bikaner', 'Ajmer', 'Udaipur', 'Alwar',
            // Tier 2 & 3
            'Bharatpur', 'Sikar', 'Bhilwara', 'Pali', 'Tonk', 'Kishangarh',
            'Beawar', 'Hanumangarh', 'Ganganagar', 'Churu', 'Jhunjhunu', 'Sawai Madhopur',
            'Bundi', 'Baran', 'Jhalawar', 'Banswara', 'Dungarpur', 'Pratapgarh',
            'Chittorgarh', 'Rajsamand', 'Bhilwara', 'Nagaur', 'Barmer', 'Jalore',
            'Sirohi', 'Mount Abu', 'Jaisalmer', 'Dausa', 'Karauli', 'Dholpur',
            'Hindaun', 'Gangapur City', 'Lachhmangarh', 'Fatehpur', 'Khetri',
            'Pilani', 'Sujangarh', 'Taranagar', 'Ratangarh', 'Sardarshahar',
            'Nokha', 'Suratgarh', 'Raisinghnagar', 'Padampur', 'Anupgarh',
            'Rawatsar', 'Sangaria', 'Vijaynagar', 'Gharsana', 'Pilibanga'
        ]
    },
    'Madhya Pradesh': {
        rtoState: 'MADHYA PRADESH',
        cities: [
            // Tier 1
            'Indore', 'Bhopal', 'Jabalpur', 'Gwalior', 'Ujjain',
            // Tier 2 & 3
            'Sagar', 'Dewas', 'Satna', 'Ratlam', 'Rewa', 'Katni', 'Singrauli',
            'Burhanpur', 'Khandwa', 'Bhind', 'Morena', 'Chhindwara', 'Guna',
            'Shivpuri', 'Vidisha', 'Chhatarpur', 'Damoh', 'Mandsaur', 'Khargone',
            'Neemuch', 'Pithampur', 'Narmadapuram', 'Hoshangabad', 'Itarsi',
            'Betul', 'Seoni', 'Balaghat', 'Mandla', 'Dindori', 'Shahdol',
            'Umaria', 'Anuppur', 'Sidhi', 'Tikamgarh', 'Niwari', 'Panna',
            'Datia', 'Sheopur', 'Ashok Nagar', 'Raghogarh', 'Rajgarh', 'Shajapur',
            'Agar Malwa', 'Susner', 'Shujalpur', 'Mhow', 'Sanawad', 'Sendhwa',
            'Barwani', 'Maheshwar', 'Omkareshwar', 'Badwani', 'Alirajpur', 'Jhabua'
        ]
    },
    'Telangana': {
        rtoState: 'TELANGANA',
        cities: [
            // Tier 1
            'Hyderabad', 'Warangal', 'Nizamabad', 'Khammam', 'Karimnagar',
            // Tier 2 & 3
            'Ramagundam', 'Mahbubnagar', 'Nalgonda', 'Adilabad', 'Suryapet',
            'Miryalaguda', 'Jagtial', 'Mancherial', 'Nirmal', 'Kamareddy',
            'Bhongir', 'Bodhan', 'Palwancha', 'Kothagudem', 'Siddipet', 'Sircilla',
            'Tandur', 'Vikarabad', 'Jangaon', 'Mahabubabad', 'Bhainsa', 'Gadwal',
            'Wanaparthy', 'Nagarkurnool', 'Narayanpet', 'Medak', 'Sangareddy',
            'Medchal', 'Shamshabad', 'Secunderabad', 'Kukatpally', 'LB Nagar',
            'Uppal', 'Dilsukhnagar', 'Kompally', 'Miyapur', 'Gachibowli',
            'Madhapur', 'Hitech City', 'Kondapur', 'Manikonda', 'Attapur'
        ]
    },
    'Andhra Pradesh': {
        rtoState: 'ANDHRA PRADESH',
        cities: [
            // Tier 1
            'Visakhapatnam', 'Vijayawada', 'Guntur', 'Nellore', 'Kurnool',
            'Rajahmundry', 'Tirupati', 'Kadapa', 'Kakinada', 'Anantapur',
            // Tier 2 & 3
            'Eluru', 'Ongole', 'Nandyal', 'Machilipatnam', 'Tenali', 'Proddatur',
            'Chittoor', 'Hindupur', 'Bhimavaram', 'Madanapalle', 'Guntakal',
            'Dharmavaram', 'Gudivada', 'Narasaraopet', 'Tadipatri', 'Mangalagiri',
            'Chilakaluripet', 'Yemmiganur', 'Kadiri', 'Chirala', 'Anakapalle',
            'Kavali', 'Palasa', 'Tanuku', 'Rayachoti', 'Srikalahasti', 'Puttaparthi',
            'Narasapuram', 'Repalle', 'Vinukonda', 'Markapur', 'Ponnur', 'Sattenapalle',
            'Bapatla', 'Addanki', 'Kandukur', 'Sullurpeta', 'Gudur', 'Venkatagiri',
            'Atmakur', 'Naidupet', 'Rajampet', 'Jammalamadugu', 'Pulivendula'
        ]
    },
    'Kerala': {
        rtoState: 'KERALA',
        cities: [
            // Tier 1
            'Thiruvananthapuram', 'Kochi', 'Kozhikode', 'Thrissur', 'Kollam',
            // Tier 2 & 3
            'Palakkad', 'Kannur', 'Malappuram', 'Alappuzha', 'Kottayam',
            'Pathanamthitta', 'Kasaragod', 'Idukki', 'Wayanad', 'Ernakulam',
            'Thalassery', 'Vatakara', 'Koyilandy', 'Ponnani', 'Tirur', 'Tanur',
            'Parappanangadi', 'Kottakkal', 'Perinthalmanna', 'Manjeri', 'Nilambur',
            'Kondotty', 'Wandoor', 'Karuvarakundu', 'Ramanattukara', 'Kalpetta',
            'Mananthavady', 'Sulthan Bathery', 'Thodupuzha', 'Munnar', 'Adimali',
            'Nedumkandam', 'Peerumedu', 'Kumily', 'Changanassery', 'Pala', 'Ettumanoor',
            'Vaikom', 'Kanjirappally', 'Mundakayam', 'Erattupetta', 'Ponkunnam',
            'Ranni', 'Kozhencherry', 'Adoor', 'Pandalam', 'Thiruvalla', 'Chengannur',
            'Mavelikara', 'Kayamkulam', 'Haripad', 'Cherthala', 'Ambalapuzha'
        ]
    },
    'Punjab': {
        rtoState: 'PUNJAB',
        cities: [
            // Tier 1
            'Ludhiana', 'Amritsar', 'Jalandhar', 'Patiala', 'Bathinda',
            // Tier 2 & 3
            'Mohali', 'Pathankot', 'Hoshiarpur', 'Batala', 'Moga', 'Malerkotla',
            'Khanna', 'Phagwara', 'Muktsar', 'Barnala', 'Rajpura', 'Firozpur',
            'Kapurthala', 'Faridkot', 'Sunam', 'Sangrur', 'Nabha', 'Malout',
            'Abohar', 'Fazilka', 'Zira', 'Kharar', 'Nangal', 'Rupnagar', 'Morinda',
            'Anandpur Sahib', 'Chamkaur Sahib', 'Naya Nangal', 'Dera Bassi',
            'Zirakpur', 'Lalru', 'Kurali', 'Samrala', 'Machhiwara', 'Raikot',
            'Payal', 'Doraha', 'Sirhind', 'Fatehgarh Sahib', 'Bassi Pathana',
            'Mandi Gobindgarh', 'Khanna', 'Amloh', 'Rampura Phul', 'Dhuri'
        ]
    },
    'Haryana': {
        rtoState: 'HARYANA',
        cities: [
            // Tier 1
            'Faridabad', 'Gurgaon', 'Gurugram', 'Panipat', 'Ambala', 'Yamunanagar',
            'Rohtak', 'Hisar', 'Karnal', 'Sonipat', 'Panchkula',
            // Tier 2 & 3
            'Bhiwani', 'Sirsa', 'Bahadurgarh', 'Jind', 'Thanesar', 'Kaithal',
            'Rewari', 'Palwal', 'Pundri', 'Kosli', 'Jhajjar', 'Farukhnagar',
            'Narnaul', 'Mahendragarh', 'Charkhi Dadri', 'Fatehabad', 'Tohana',
            'Ratia', 'Ellenabad', 'Dabwali', 'Rania', 'Kalanwali', 'Adampur',
            'Hansi', 'Barwala', 'Narwana', 'Safidon', 'Gohana', 'Gannaur',
            'Assandh', 'Nilokheri', 'Indri', 'Gharaunda', 'Taraori', 'Shahabad',
            'Pehowa', 'Kurukshetra', 'Ladwa', 'Radaur', 'Jagadhri', 'Chhachhrauli',
            'Naraingarh', 'Kalka', 'Pinjore', 'Barara', 'Shahzadpur', 'Mustafabad'
        ]
    },
    'Bihar': {
        rtoState: 'BIHAR',
        cities: [
            // Tier 1
            'Patna', 'Gaya', 'Bhagalpur', 'Muzaffarpur', 'Darbhanga', 'Purnia',
            'Arrah', 'Begusarai', 'Katihar', 'Munger',
            // Tier 2 & 3
            'Chhapra', 'Saharsa', 'Sasaram', 'Hajipur', 'Dehri', 'Siwan',
            'Motihari', 'Nawada', 'Bagaha', 'Buxar', 'Kishanganj', 'Sitamarhi',
            'Jamalpur', 'Jehanabad', 'Aurangabad', 'Bettiah', 'Madhubani', 'Samastipur',
            'Supaul', 'Madhepura', 'Khagaria', 'Lakhisarai', 'Sheikhpura', 'Jamui',
            'Banka', 'Araria', 'Forbesganj', 'Nirmali', 'Jale', 'Rosera',
            'Dalsinghsarai', 'Harnaut', 'Hilsa', 'Islampur', 'Barh', 'Mokama',
            'Biharsharif', 'Rajgir', 'Nalanda', 'Sheikhpura', 'Lakhisarai', 'Jamui',
            'Banka', 'Bhagalpur', 'Naugachhia', 'Sultanganj', 'Kahalgaon', 'Pirpainti'
        ]
    },
    'Odisha': {
        rtoState: 'ODISHA',
        cities: [
            // Tier 1
            'Bhubaneswar', 'Cuttack', 'Rourkela', 'Berhampur', 'Sambalpur',
            // Tier 2 & 3
            'Puri', 'Balasore', 'Bhadrak', 'Baripada', 'Jharsuguda', 'Bargarh',
            'Rayagada', 'Balangir', 'Jeypore', 'Bhawanipatna', 'Barbil', 'Paradip',
            'Angul', 'Dhenkanal', 'Jajpur', 'Kendrapara', 'Jagatsinghpur', 'Khordha',
            'Nayagarh', 'Ganjam', 'Gajapati', 'Kandhamal', 'Boudh', 'Subarnapur',
            'Sonepur', 'Nuapada', 'Nabarangpur', 'Koraput', 'Malkangiri', 'Kalahandi',
            'Phulbani', 'Chhatrapur', 'Aska', 'Digapahandi', 'Khallikote', 'Polasara',
            'Kabisuryanagar', 'Banki', 'Athagarh', 'Baramba', 'Tigiria', 'Kamakhyanagar',
            'Parjang', 'Talcher', 'Pallahara', 'Kaniha', 'Athmallik', 'Hindol'
        ]
    },
    'Assam': {
        rtoState: 'ASSAM',
        cities: [
            // Tier 1
            'Guwahati', 'Silchar', 'Dibrugarh', 'Jorhat', 'Nagaon', 'Tinsukia',
            // Tier 2 & 3
            'Tezpur', 'Bongaigaon', 'Dhubri', 'Diphu', 'North Lakhimpur', 'Karimganj',
            'Sivasagar', 'Goalpara', 'Barpeta', 'Nalbari', 'Mangaldoi', 'Haflong',
            'Kokrajhar', 'Hailakandi', 'Morigaon', 'Hojai', 'Golaghat', 'Dhemaji',
            'Bongaigaon', 'Udalguri', 'Darrang', 'Baksa', 'Kamrup', 'Kamrup Metropolitan',
            'Chirang', 'Sonitpur', 'Lakhimpur', 'Majuli', 'Biswanath', 'Charaideo',
            'South Salmara-Mankachar', 'West Karbi Anglong', 'Dima Hasao', 'Karbi Anglong',
            'Cachar', 'Hailakandi', 'Karimganj', 'Barak Valley', 'Brahmaputra Valley'
        ]
    },
    'Jharkhand': {
        rtoState: 'JHARKHAND',
        cities: [
            // Tier 1
            'Ranchi', 'Jamshedpur', 'Dhanbad', 'Bokaro', 'Deoghar',
            // Tier 2 & 3
            'Hazaribagh', 'Giridih', 'Ramgarh', 'Medininagar', 'Chatra', 'Gumla',
            'Dumka', 'Phusro', 'Chaibasa', 'Mihijam', 'Sahibganj', 'Madhupur',
            'Pakur', 'Godda', 'Sahebganj', 'Jamtara', 'Koderma', 'Latehar',
            'Lohardaga', 'Simdega', 'Khunti', 'Garhwa', 'Palamu', 'Chatra',
            'Hazaribag', 'Koderma', 'Giridih', 'Deoghar', 'Jamtara', 'Dumka',
            'Pakur', 'Godda', 'Sahebganj', 'Rajmahal', 'Barharwa', 'Borio',
            'Mahagama', 'Shikaripara', 'Nala', 'Bishrampur', 'Garhwa', 'Bhawanathpur'
        ]
    },
    'Chhattisgarh': {
        rtoState: 'CHHATTISGARH',
        cities: [
            // Tier 1
            'Raipur', 'Bhilai', 'Bilaspur', 'Korba', 'Durg',
            // Tier 2 & 3
            'Rajnandgaon', 'Jagdalpur', 'Raigarh', 'Ambikapur', 'Mahasamund',
            'Dhamtari', 'Chirmiri', 'Bhatapara', 'Dalli-Rajhara', 'Naila Janjgir',
            'Tilda Newra', 'Mungeli', 'Manendragarh', 'Sakti', 'Kawardha', 'Bemetara',
            'Balod', 'Baloda Bazar', 'Gariaband', 'Janjgir-Champa', 'Jashpur',
            'Kabirdham', 'Kanker', 'Kondagaon', 'Koriya', 'Mungeli', 'Narayanpur',
            'Sukma', 'Surajpur', 'Surguja', 'Balrampur', 'Bijapur', 'Dantewada',
            'Bastar', 'Kondagaon', 'Narayanpur', 'Kanker', 'Rajnandgaon', 'Kawardha'
        ]
    },
    'Uttarakhand': {
        rtoState: 'UTTARAKHAND',
        cities: [
            // Tier 1
            'Dehradun', 'Haridwar', 'Roorkee', 'Haldwani', 'Rudrapur',
            // Tier 2 & 3
            'Kashipur', 'Rishikesh', 'Kotdwar', 'Ramnagar', 'Pithoragarh', 'Jaspur',
            'Almora', 'Nainital', 'Mussoorie', 'Tehri', 'Pauri', 'Srinagar',
            'Uttarkashi', 'Chamoli', 'Rudraprayag', 'Bageshwar', 'Champawat',
            'Kichha', 'Sitarganj', 'Tanakpur', 'Bazpur', 'Gadarpur', 'Khatima',
            'Nanakmatta', 'Kaladhungi', 'Lalkuan', 'Bhimtal', 'Ranikhet', 'Bageshwar',
            'Kausani', 'Munsyari', 'Didihat', 'Berinag', 'Gangolihat', 'Lohaghat'
        ]
    },
    'Himachal Pradesh': {
        rtoState: 'HIMACHAL PRADESH',
        cities: [
            // Tier 1
            'Shimla', 'Mandi', 'Solan', 'Nahan', 'Sundarnagar',
            // Tier 2 & 3
            'Palampur', 'Kullu', 'Hamirpur', 'Dharamshala', 'Kangra', 'Una',
            'Bilaspur', 'Chamba', 'Dalhousie', 'Manali', 'Baddi', 'Parwanoo',
            'Nalagarh', 'Arki', 'Kasauli', 'Dagshai', 'Sabathu', 'Rampur',
            'Rohru', 'Theog', 'Kotkhai', 'Jubbal', 'Chopal', 'Narkanda',
            'Kumarsain', 'Anni', 'Karsog', 'Jogindernagar', 'Thunag', 'Chachiot',
            'Nihri', 'Baldwara', 'Sarkaghat', 'Nadaun', 'Sujanpur', 'Amb',
            'Bangana', 'Gagret', 'Haroli', 'Tahliwal', 'Ghumarwin', 'Jhandutta'
        ]
    },
    'Goa': {
        rtoState: 'GOA',
        cities: [
            'Panaji', 'Margao', 'Vasco da Gama', 'Mapusa', 'Ponda', 'Bicholim',
            'Curchorem', 'Sanquelim', 'Cuncolim', 'Quepem', 'Canacona', 'Pernem',
            'Valpoi', 'Sanguem', 'Aldona', 'Arambol', 'Anjuna', 'Calangute',
            'Candolim', 'Colva', 'Benaulim', 'Betalbatim', 'Majorda', 'Varca',
            'Cavelossim', 'Mobor', 'Agonda', 'Palolem', 'Patnem', 'Chaudi'
        ]
    },
    'Jammu and Kashmir': {
        rtoState: 'JAMMU & KASHMIR (UT)',
        cities: [
            'Srinagar', 'Jammu', 'Anantnag', 'Baramulla', 'Sopore', 'Kathua',
            'Udhampur', 'Rajouri', 'Poonch', 'Doda', 'Ramban', 'Kishtwar',
            'Pulwama', 'Shopian', 'Kulgam', 'Budgam', 'Ganderbal', 'Bandipora',
            'Kupwara', 'Handwara', 'Uri', 'Gulmarg', 'Pahalgam', 'Sonamarg',
            'Katra', 'Reasi', 'Samba', 'Akhnoor', 'Bishnah', 'R.S. Pura'
        ]
    },
    'Chandigarh': {
        rtoState: 'CHANDIGARH (UT)',
        cities: ['Chandigarh', 'Sector 17', 'Sector 22', 'Sector 35', 'Mani Majra']
    },
    'Puducherry': {
        rtoState: 'PUDUCHERRY (UT)',
        cities: ['Puducherry', 'Karaikal', 'Mahe', 'Yanam', 'Ozhukarai', 'Villianur']
    },
    'Tripura': {
        rtoState: 'TRIPURA',
        cities: ['Agartala', 'Dharmanagar', 'Udaipur', 'Kailasahar', 'Belonia', 'Khowai', 'Ambassa', 'Teliamura', 'Sabroom', 'Sonamura']
    },
    'Meghalaya': {
        rtoState: 'MEGHALAYA',
        cities: ['Shillong', 'Tura', 'Jowai', 'Nongstoin', 'Baghmara', 'Williamnagar', 'Nongpoh', 'Mairang', 'Resubelpara', 'Ampati']
    },
    'Manipur': {
        rtoState: 'MANIPUR',
        cities: ['Imphal', 'Thoubal', 'Bishnupur', 'Churachandpur', 'Ukhrul', 'Senapati', 'Tamenglong', 'Chandel', 'Jiribam', 'Kakching']
    },
    'Mizoram': {
        rtoState: 'MIZORAM',
        cities: ['Aizawl', 'Lunglei', 'Champhai', 'Serchhip', 'Kolasib', 'Lawngtlai', 'Saiha', 'Mamit']
    },
    'Nagaland': {
        rtoState: 'NAGALAND',
        cities: ['Kohima', 'Dimapur', 'Mokokchung', 'Tuensang', 'Wokha', 'Zunheboto', 'Phek', 'Mon', 'Kiphire', 'Longleng', 'Peren']
    },
    'Arunachal Pradesh': {
        rtoState: 'ARUNACHAL PRADESH',
        cities: ['Itanagar', 'Naharlagun', 'Pasighat', 'Tawang', 'Ziro', 'Bomdila', 'Tezu', 'Seppa', 'Along', 'Roing', 'Changlang', 'Khonsa']
    },
    'Sikkim': {
        rtoState: 'SIKKIM',
        cities: ['Gangtok', 'Namchi', 'Geyzing', 'Mangan', 'Jorethang', 'Rangpo', 'Singtam', 'Ravangla']
    }
};

// Generate the TypeScript file
function generateCityDatabase() {
    let allCities = [];
    let popularCount = 0;
    let totalCount = 0;

    // Process all states
    for (const [state, data] of Object.entries(CITIES_BY_STATE)) {
        const rtoState = data.rtoState;
        const cities = data.cities;

        cities.forEach((city, index) => {
            // First 5-10 cities per major state are popular
            const isPopular = (state === 'Maharashtra' || state === 'Delhi' || state === 'Karnataka' ||
                state === 'Tamil Nadu' || state === 'Uttar Pradesh' || state === 'West Bengal' ||
                state === 'Gujarat' || state === 'Rajasthan' || state === 'Madhya Pradesh' ||
                state === 'Telangana' || state === 'Andhra Pradesh' || state === 'Kerala' ||
                state === 'Punjab' || state === 'Haryana' || state === 'Bihar') && index < 7;

            allCities.push({
                city,
                state,
                rtoState,
                popular: isPopular
            });

            if (isPopular) popularCount++;
            totalCount++;
        });
    }

    // Generate TypeScript content
    const tsContent = `/**
 * Comprehensive City Database for India
 * Auto-generated comprehensive list of ${totalCount}+ cities
 * Generated on: ${new Date().toISOString()}
 * Tier 1 (Popular): ${popularCount}
 * All Tiers: ${totalCount}
 */

export interface CityData {
    city: string;
    state: string;
    rtoState: string;
    popular: boolean;
}

export const CITY_DATABASE: CityData[] = [
${allCities.map(c => `    { city: '${c.city}', state: '${c.state}', rtoState: '${c.rtoState}', popular: ${c.popular} }`).join(',\n')}
];

// Create fast lookup maps
const cityToStateMap = new Map<string, CityData>();
const stateToRTOMap = new Map<string, string>();

// Initialize maps for O(1) lookup
CITY_DATABASE.forEach(cityData => {
    cityToStateMap.set(cityData.city.toLowerCase(), cityData);
    stateToRTOMap.set(cityData.state.toUpperCase(), cityData.rtoState);
});

/**
 * Get RTO state name from city (O(1) lookup)
 */
export function getRTOStateFromCity(city: string): string {
    const cityData = cityToStateMap.get(city.toLowerCase());
    if (cityData) {
        return cityData.rtoState;
    }

    const upperCity = city.toUpperCase();
    const rtoState = stateToRTOMap.get(upperCity);
    if (rtoState) {
        return rtoState;
    }

    console.warn(\`City "\${city}" not found in database, using Maharashtra default\`);
    return 'MAHARASHTRA';
}

/**
 * Get state name from city
 */
export function getStateFromCity(city: string): string {
    const cityData = cityToStateMap.get(city.toLowerCase());
    return cityData?.state || 'Maharashtra';
}

/**
 * Get popular cities for dropdown
 */
export function getPopularCities(): CityData[] {
    return CITY_DATABASE.filter(c => c.popular);
}

/**
 * Get all cities sorted alphabetically
 */
export function getAllCities(): CityData[] {
    return [...CITY_DATABASE].sort((a, b) => a.city.localeCompare(b.city));
}

/**
 * Search cities by name (fuzzy search)
 */
export function searchCities(query: string): CityData[] {
    const lowerQuery = query.toLowerCase();
    return CITY_DATABASE.filter(c =>
        c.city.toLowerCase().includes(lowerQuery) ||
        c.state.toLowerCase().includes(lowerQuery)
    ).slice(0, 10);
}

/**
 * Normalize Google Maps state name to RTO state format
 */
export function normalizeStateToRTO(stateName: string): string {
    const upperState = stateName.toUpperCase();
    const rtoState = stateToRTOMap.get(upperState);
    if (rtoState) {
        return rtoState;
    }

    const stateMapping: Record<string, string> = {
        'DELHI': 'THE GOV OF NCT OF DELHI (UT)',
        'NCT OF DELHI': 'THE GOV OF NCT OF DELHI (UT)',
        'NATIONAL CAPITAL TERRITORY OF DELHI': 'THE GOV OF NCT OF DELHI (UT)',
        'CHANDIGARH': 'CHANDIGARH (UT)',
        'PUDUCHERRY': 'PUDUCHERRY (UT)',
        'PONDICHERRY': 'PUDUCHERRY (UT)',
        'JAMMU AND KASHMIR': 'JAMMU & KASHMIR (UT)',
        'JAMMU & KASHMIR': 'JAMMU & KASHMIR (UT)',
    };

    const mapped = stateMapping[upperState];
    if (mapped) {
        return mapped;
    }

    console.warn(\`State "\${stateName}" not in RTO database, using as-is\`);
    return upperState;
}

/**
 * Get RTO state from Google Maps-style city/state string
 */
export function getRTOStateFromGoogleMaps(cityState: string): string {
    const parts = cityState.split(',').map(p => p.trim());
    const city = parts[0];
    const state = parts[1];

    if (city) {
        const cityData = cityToStateMap.get(city.toLowerCase());
        if (cityData) {
            return cityData.rtoState;
        }
    }

    if (state) {
        return normalizeStateToRTO(state);
    }

    console.warn(\`Could not determine RTO state for "\${cityState}", using Maharashtra\`);
    return 'MAHARASHTRA';
}
`;

    // Write to file
    const outputPath = path.join(__dirname, '..', 'lib', 'city-database.ts');
    fs.writeFileSync(outputPath, tsContent, 'utf8');

    console.log(`\n✅ City database generated successfully!`);
    console.log(`📁 File: ${outputPath}`);
    console.log(`\n📈 Statistics:`);
    console.log(`   - Total cities: ${totalCount}`);
    console.log(`   - Popular cities: ${popularCount}`);
    console.log(`   - States/UTs covered: ${Object.keys(CITIES_BY_STATE).length}`);
    console.log(`\n🎉 Done!`);
}

// Run the generator
generateCityDatabase();
