"""
Medicine Database for Disease Recommendations
Maps diseases to recommended medicines
"""

MEDICINE_DATABASE = {
    # Fungal Infections
    "Fungal infection": ["Clotrimazole", "Fluconazole", "Miconazole", "Terbinafine"],
    
    # Allergies
    "Allergy": ["Cetirizine", "Loratadine", "Fexofenadine", "Diphenhydramine"],
    
    # GERD
    "GERD": ["Omeprazole", "Esomeprazole", "Ranitidine", "Famotidine"],
    
    # Chronic Cholestasis
    "Chronic cholestasis": ["Ursodeoxycholic acid", "Cholestyramine", "Naltrexone"],
    
    # Drug Reaction
    "Drug reaction": ["Antihistamines", "Corticosteroids", "Epinephrine"],
    
    # Peptic Ulcer Disease
    "Peptic ulcer diseae": ["Omeprazole", "Famotidine", "Sucralfate", "Bismuth"],
    
    # AIDS
    "AIDS": ["Antiretroviral therapy (ART)", "Zidovudine", "Protease inhibitors"],
    
    # Diabetes
    "Diabetes": ["Metformin", "Insulin", "Glibenclamide", "Sitagliptin"],
    
    # Osteoarthritis
    "Osteoarthritis": ["Paracetamol", "Ibuprofen", "Glucosamine", "Corticosteroids"],
    
    # Bronchiectasis
    "Bronchiectasis": ["Amoxicillin", "Azithromycin", "Nebulized saline"],
    
    # Hypertension
    "Hypertension": ["Lisinopril", "Amlodipine", "Losartan", "Metoprolol"],
    
    # Migraine
    "Migraine": ["Sumatriptan", "Propranolol", "Topiramate", "Ibuprofen"],
    
    # Cervical Spondylosis
    "Cervical spondylosis": ["Paracetamol", "Ibuprofen", "Muscle relaxants", "Physiotherapy"],
    
    # Paralysis (Cerebral Palsy)
    "Paralysis (cerebral palsy)": ["Baclofen", "Diazepam", "Botulinum toxin", "Physiotherapy"],
    
    # Hepatitis A
    "Hepatitis A": ["Supportive care", "Rest", "Hydration", "Vitamin E"],
    
    # Hepatitis B
    "Hepatitis B": ["Interferon", "Lamivudine", "Entecavir", "Tenofovir"],
    
    # Hepatitis C
    "Hepatitis C": ["Sofosbuvir", "Ledipasvir", "Daclatasvir", "Direct antivirals"],
    
    # Hepatitis D
    "Hepatitis D": ["Interferon alpha", "Lamivudine", "Supportive care"],
    
    # Hepatitis E
    "Hepatitis E": ["Supportive care", "Rest", "Hydration", "Monitor liver function"],
    
    # Alcoholic Hepatitis
    "Alcoholic hepatitis": ["Corticosteroids", "Supportive care", "Abstinence from alcohol"],
    
    # Tuberculosis
    "Tuberculosis": ["Isoniazid", "Rifampicin", "Pyrazinamide", "Ethambutol"],
    
    # Common Cold
    "Common Cold": ["Vitamin C", "Zinc", "Decongestants", "Rest"],
    
    # Pneumonia
    "Pneumonia": ["Amoxicillin", "Azithromycin", "Levofloxacin", "Oxygen therapy"],
    
    # Dimorphic Hemmorhages
    "Dimorphic hemmorhages": ["Transfusion", "Iron supplements", "Vitamin K"],
    
    # Heart Attack
    "Heart attack": ["Aspirin", "Nitroglycerin", "Beta-blockers", "Statins", "Emergency care"],
    
    # Varicose Veins
    "Varicose veins": ["Compression stockings", "Venotonics", "Sclerotherapy", "Surgery"],
    
    # Hypothyroidism
    "Hypothyroidism": ["Levothyroxine", "Desiccated thyroid", "Monitor TSH levels"],
    
    # Hyperthyroidism
    "Hyperthyroidism": ["Propranolol", "Antithyroid drugs", "Iodine", "Beta-blockers"],
    
    # Hypoglycemia
    "Hypoglycemia": ["Glucose tablets", "Honey", "Juice", "Glucagon injection"],
    
    # Osteoporosis
    "Osteoporosis": ["Calcium", "Vitamin D", "Alendronate", "Hormone therapy"],
    
    # Arthritis
    "Arthritis": ["NSAIDs", "Corticosteroids", "DMARDs", "Biologics"],
    
    # (Vertigo) Paroxysmal Positional Vertigo
    "(vertigo) Paroxysmal Positional Vertigo": ["Canalith repositioning", "Vestibular rehab", "Meclizine"],
    
    # Acne
    "Acne": ["Benzoyl peroxide", "Salicylic acid", "Retinoids", "Antibiotics", "Isotretinoin"],
    
    # Urinary Tract Infection
    "Urinary tract infection": ["Ciprofloxacin", "Trimethoprim", "Nitrofurantoin", "Hydration"],
    
    # Psoriasis
    "Psoriasis": ["Topical corticosteroids", "Retinoids", "Biologic agents", "Phototherapy"],
    
    # Impetigo
    "Impetigo": ["Mupirocin", "Amoxicillin", "Erythromycin", "Antibiotics"],
}

def get_medicines(disease):
    """
    Get medicine recommendations for a disease
    
    Args:
        disease (str): Disease name
    
    Returns:
        list: List of recommended medicines
    """
    # Try exact match first
    if disease in MEDICINE_DATABASE:
        return MEDICINE_DATABASE[disease]
    
    # Try case-insensitive match
    for db_disease, medicines in MEDICINE_DATABASE.items():
        if db_disease.lower() == disease.lower():
            return medicines
    
    # If not found, return default recommendation
    return ["Consult a qualified healthcare provider for proper diagnosis and treatment"]

def get_all_diseases():
    """Get list of all diseases in database"""
    return list(MEDICINE_DATABASE.keys())
