const { createClient } = require('@supabase/supabase-js');
const { faker } = require('@faker-js/faker');

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function seedCampaigns() {
    try {
        const campaigns = [];
        for (let i = 0; i < 10; i++) {
            campaigns.push({
                name: faker.lorem.words(3),
                status: faker.helpers.arrayElement(['active', 'paused', 'completed', 'pending']),
                budget: faker.finance.amount(1000, 100000, 2),
                start_date: faker.date.past().toISOString().split('T')[0],
                end_date: faker.date.future().toISOString().split('T')[0],
                target_audience: faker.lorem.sentence(),
                channels: faker.helpers.arrayElements(['email', 'social media', 'ads', 'seo', 'content marketing'], { min: 1, max: 3 }).join(','),
                niche: faker.commerce.department(),
            });
        }

        console.log('Inserting campaigns:', campaigns);

        const { data, error } = await supabase.from('campaigns').insert(campaigns).select();

        if (error) {
            console.error('Error seeding campaigns:', error.message);
        } else {
            console.log('Campaigns seeded successfully:', data.length);
        }
    } catch (error) {
        console.error('Error in seedCampaigns function:', error.message);
    }
}

async function main() {
    console.log('Seeding database...');
    await seedCampaigns();
    console.log('Database seeding complete.');
}

main();