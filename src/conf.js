export const currentYear = new Date().getFullYear()

export const contactEmail = 'contact@hei.school'

export const predefinedFeeTypes = {
  annualTuition1x: [{ type: 'TUITION', name: 'Écolage annuel 1x', monthlyAmount: 1_740_000, monthsNumber: 1 }],
  annualTuition9x: [
    { type: 'TUITION', name: 'Écolage annuel 9x', monthlyAmount: 240_000, monthsNumber: 1 },
    { type: 'TUITION', name: 'Écolage annuel 9x', monthlyAmount: 215_000, monthsNumber: 8 }
  ],
  biAnnualTuition1x: [{ type: 'TUITION', name: 'Écolage semestriel 1x', monthlyAmount: 870_000, monthsNumber: 1 }],
  hardwareConf1_8x: [{ type: 'HARDWARE', name: 'Matériel conf1 8x', monthlyAmount: 240_000, monthsNumber: 8 }],
  hardwareConf2_8x: [{ type: 'HARDWARE', name: 'Matériel conf2 8x', monthlyAmount: 210_000, monthsNumber: 8 }],
  entranceExam: [{ type: 'ENTRANCE_EXAM', name: 'Concours', monthlyAmount: 40_000, monthsNumber: 1 }],
  knwoledgeValidationExam: [
    {
      type: 'KNOWLEDGE_VALIDATION_EXAM',
      name: 'VAE examen',
      monthlyAmount: 25_000,
      monthsNumber: 1
    }
  ],
  knwoledgeValidationApplication: [
    {
      type: 'KNOWLEDGE_VALIDATION_APPLICATION',
      name: 'VAE application',
      monthlyAmount: 250_000,
      monthsNumber: 1
    }
  ]
}
export const manualFeeTypes = {
  tuition: { name: 'Écolage', type: 'TUITION' },
  hardware: { name: 'Matériel', type: 'HARDWARE' }
}

export const predefinedFirstDueDates = {
  // /!\ note(js-months): months are zero-based in JS
  date1: { name: `15 octobre ${currentYear}`, value: new Date(currentYear, 9, 15) },
  date2: { name: `15 janvier ${currentYear + 1}`, value: new Date(currentYear + 1, 0, 15) }
}

export const paymentTypes = {
  cash: { name: 'Cash', type: 'CASH' },
  mobileMoney: { name: 'Mobile money', type: 'MOBILE_MONEY' }
}
