export const currentYear = 2021

export const predefinedFeeTypes = {
  annualTuition1x: { id: 'ANNUAL_TUITION_1X', type: 'TUITION', name: 'Écolage annuel 1x', monthlyAmount: 1_600_000, monthsNumber: 1 },
  annualTuition8x: { id: 'ANNUAL_TUITION_8X', type: 'TUITION', name: 'Écolage annuel 8x', monthlyAmount: 250_000, monthsNumber: 8 },
  annualTuition9x: { id: 'ANNUAL_TUITION_9X', type: 'TUITION', name: 'Écolage annuel 9x', monthlyAmount: 200_000, monthsNumber: 9 },
  biAnnualTuition1x: { id: 'BIANNUAL_TUITION_1x', type: 'TUITION', name: 'Écolage semestriel 1x', monthlyAmount: 800_000, monthsNumber: 1 },
  biAnnualTuition4x: { id: 'BIANNUAL_TUITION_4x', type: 'TUITION', name: 'Écolage semestriel 4x', monthlyAmount: 250_000, monthsNumber: 4 },
  hardwareConf1_8x: { id: 'HARDWARE_CONF1_8x', type: 'HARDWARE', name: 'Matériel conf1 8x', monthlyAmount: 250_000, monthsNumber: 8 },
  hardwareConf2_8x: { id: 'HARDWARE_CONF2_8x', type: 'HARDWARE', name: 'Matériel conf2 8x', monthlyAmount: 200_000, monthsNumber: 8 },
  entranceExam: { id: 'ENTRANCE_EXAM', type: 'ENTRANCE_EXAM', name: 'Concours', monthlyAmount: 40_000, monthsNumber: 1 },
  knwoledgeValidationExam: {
    id: 'KNOWLEDGE_VALIDATION_EXAM',
    type: 'ENTRANCE_EXAM',
    name: 'VAE examen',
    monthlyAmount: 50_000,
    monthsNumber: 1
  },
  knwoledgeValidationApplication: {
    id: 'KNOWLEDGE_VALIDATION_APPLICATION',
    type: 'KNOWLEDGE_VALIDATION',
    name: 'VAE application',
    monthlyAmount: 200_000,
    monthsNumber: 1
  }
}

export const manualFeeTypes = {
  tuition: { name: 'Écolage' },
  hardware: { name: 'Matériel' }
}

export const predefinedFirstDueDates = {
  oct21: { name: '15 octobre 2021', value: new Date(2021, 10, 15) },
  jan22: { name: '15 janvier 2022', value: new Date(2022, 1, 15) },
  apr22: { name: '15 avril 2022', value: new Date(2022, 4, 15) }
}
