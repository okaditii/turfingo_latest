import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wghhsvrcqplclzgcciku.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndnaGhzdnJjcXBsY2x6Z2NjaWt1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzU3NTg3OTIsImV4cCI6MjA5MTMzNDc5Mn0.l1qPa0NVpKSjj0DIx7nMNOpFB7cl_XfhLPt12dC3ZDU'

const supabase = createClient(supabaseUrl, supabaseKey)

const players = [
    { player_name: 'Arjun Mehta', email: 'arjun.mehta@gmail.com', phone: '9876543210', age: 16, age_group: 'Under 18', sport: 'Football', team_name: 'Mumbai Strikers FC', city: 'Mumbai', guardian_name: 'Rajesh Mehta', guardian_phone: '9876543200' },
    { player_name: 'Priya Sharma', email: 'priya.sharma@yahoo.com', phone: '9812345678', age: 14, age_group: 'Under 16', sport: 'Football', team_name: 'Delhi Dynamos Academy', city: 'Delhi', guardian_name: 'Sanjay Sharma', guardian_phone: '9812345600' },
    { player_name: 'Rohan Patel', email: 'rohan.patel@outlook.com', phone: '9988776655', age: 22, age_group: 'Open (18+)', sport: 'Football', team_name: 'Ahmedabad Warriors', city: 'Ahmedabad' },
    { player_name: 'Sneha Reddy', email: 'sneha.r@gmail.com', phone: '9887766554', age: 12, age_group: 'Under 14', sport: 'Football', team_name: 'Hyderabad Football Academy', city: 'Hyderabad', guardian_name: 'Venkat Reddy', guardian_phone: '9887766500' },
    { player_name: 'Karan Singh', email: 'karan.singh@gmail.com', phone: '9776655443', age: 19, age_group: 'Open (18+)', sport: 'Football', team_name: 'Chandigarh FC', city: 'Chandigarh' },
    { player_name: 'Ananya Iyer', email: 'ananya.iyer@gmail.com', phone: '9665544332', age: 10, age_group: 'Under 12', sport: 'Football', team_name: 'Chennai United Youth', city: 'Chennai', guardian_name: 'Lakshmi Iyer', guardian_phone: '9665544300' },
    { player_name: 'Vikram Joshi', email: 'vikram.joshi@hotmail.com', phone: '9554433221', age: 17, age_group: 'Under 18', sport: 'Football', team_name: 'Pune City Academy', city: 'Pune', guardian_name: 'Anil Joshi', guardian_phone: '9554433200' },
    { player_name: 'Diya Nair', email: 'diya.nair@gmail.com', phone: '9443322110', age: 15, age_group: 'Under 16', sport: 'Football', team_name: 'Kochi Blasters Youth', city: 'Kochi', guardian_name: 'Suresh Nair', guardian_phone: '9443322100' },
    { player_name: 'Aditya Kapoor', email: 'aditya.kapoor@gmail.com', phone: '9332211009', age: 25, age_group: 'Open (18+)', sport: 'Football', team_name: 'Bengaluru FC Academy', city: 'Bengaluru' },
    { player_name: 'Meera Gupta', email: 'meera.gupta@yahoo.com', phone: '9221100998', age: 9, age_group: 'Under 10', sport: 'Football', team_name: 'Jaipur Rising Stars', city: 'Jaipur', guardian_name: 'Amit Gupta', guardian_phone: '9221100900' },
    { player_name: 'Ishaan Verma', email: 'ishaan.v@gmail.com', phone: '9110099887', age: 13, age_group: 'Under 14', sport: 'Football', team_name: 'Lucknow Tigers FC', city: 'Lucknow', guardian_name: 'Ravi Verma', guardian_phone: '9110099800' },
    { player_name: 'Tara Bhatt', email: 'tara.bhatt@gmail.com', phone: '9009988776', age: 20, age_group: 'Open (18+)', sport: 'Football', team_name: 'Goa United Academy', city: 'Goa' },
    { player_name: 'Rishi Das', email: 'rishi.das@outlook.com', phone: '8998877665', age: 11, age_group: 'Under 12', sport: 'Football', team_name: 'Kolkata Mohan Bagan Youth', city: 'Kolkata', guardian_name: 'Subir Das', guardian_phone: '8998877600' },
    { player_name: 'Kavya Menon', email: 'kavya.m@gmail.com', phone: '8887766554', age: 16, age_group: 'Under 18', sport: 'Football', team_name: 'Thiruvananthapuram FC', city: 'Thiruvananthapuram', guardian_name: 'Mohan Menon', guardian_phone: '8887766500' },
    { player_name: 'Sahil Khan', email: 'sahil.khan@gmail.com', phone: '8776655443', age: 23, age_group: 'Open (18+)', sport: 'Football', team_name: 'Indore Blitz FC', city: 'Indore' },
    { player_name: 'Nisha Pillai', email: 'nisha.pillai@yahoo.com', phone: '8665544332', age: 8, age_group: 'Under 10', sport: 'Football', team_name: 'Coimbatore Football Club', city: 'Coimbatore', guardian_name: 'Gopi Pillai', guardian_phone: '8665544300' },
    { player_name: 'Dev Malhotra', email: 'dev.m@gmail.com', phone: '8554433221', age: 15, age_group: 'Under 16', sport: 'Football', team_name: 'Noida Sports Academy', city: 'Noida', guardian_name: 'Rajiv Malhotra', guardian_phone: '8554433200' },
    { player_name: 'Aisha Bano', email: 'aisha.bano@gmail.com', phone: '8443322110', age: 18, age_group: 'Open (18+)', sport: 'Football', team_name: 'Srinagar Football Academy', city: 'Srinagar' },
    { player_name: 'Yash Tiwari', email: 'yash.t@hotmail.com', phone: '8332211009', age: 14, age_group: 'Under 16', sport: 'Football', team_name: 'Bhopal United Youth', city: 'Bhopal', guardian_name: 'Sandeep Tiwari', guardian_phone: '8332211000' },
    { player_name: 'Ritu Choudhary', email: 'ritu.c@gmail.com', phone: '8221100998', age: 21, age_group: 'Open (18+)', sport: 'Football', team_name: 'Nagpur City FC', city: 'Nagpur' },
]

function generateRegistrationId() {
    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'
    let result = 'TF-'
    for (let i = 0; i < 6; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    return result
}

async function seed() {
    console.log('Seeding 20 test registrations...\n')

    for (const player of players) {
        const regId = generateRegistrationId()
        const record = {
            registration_id: regId,
            ...player,
            payment_id: `pay_test_${Math.random().toString(36).substring(2, 15)}`,
            payment_status: 'paid',
            amount: 199,
            registered_at: new Date(Date.now() - Math.floor(Math.random() * 7 * 24 * 60 * 60 * 1000)).toISOString(),
        }

        const { error } = await supabase.from('registrations').insert([record])

        if (error) {
            console.error(`❌ Failed: ${player.player_name} - ${error.message}`)
        } else {
            console.log(`✅ ${regId} - ${player.player_name} (${player.city})`)
        }
    }

    console.log('\nDone! 🎉')
}

seed()
