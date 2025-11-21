const backendUrl = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:5001'

async function debugPopularCarsAPI() {
    console.log('=== Debugging Popular Cars API ===')

    // Fetch the Hyundai Creta model directly
    const modelRes = await fetch(`${backendUrl}/api/models/model-brand-hyundai-creta`)
    const modelData = await modelRes.json()
    console.log('\nHyundai Creta Model Data:')
    console.log(JSON.stringify(modelData, null, 2))

    // Fetch variants for Hyundai Creta
    const variantsRes = await fetch(`${backendUrl}/api/variants?modelId=model-brand-hyundai-creta`)
    const variantsData = await variantsRes.json()
    console.log('\nHyundai Creta Variants Count:', variantsData.length)

    // Extract unique fuel types
    const fuelTypes = Array.from(new Set(variantsData.map((v: any) => v.fuelType).filter(Boolean)))
    console.log('Unique Fuel Types from Variants:', fuelTypes)

    // Extract unique transmissions
    const transmissions = Array.from(new Set(variantsData.map((v: any) => v.transmission).filter(Boolean)))
    console.log('Unique Transmissions from Variants:', transmissions)

    // Show first 3 variants
    console.log('\nFirst 3 Variants:')
    variantsData.slice(0, 3).forEach((v: any, i: number) => {
        console.log(`\nVariant ${i + 1}:`, v.name)
        console.log('  Fuel Type:', v.fuelType)
        console.log('  Transmission:', v.transmission)
    })
}

debugPopularCarsAPI().catch(console.error)
