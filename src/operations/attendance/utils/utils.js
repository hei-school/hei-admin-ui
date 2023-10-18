export function getObjValue(obj, path) {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== 'undefined' ? acc[key] : undefined), {...obj});
}

export const dateOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'numeric',
  day: 'numeric',
  hour: 'numeric',
  minute: 'numeric',
  second: 'numeric',
};

export function formatDate(dateIso) {
  if (!dateIso) {
    return
  }

  const date = new Date(dateIso)
  const formatter = new Intl.DateTimeFormat('fr-FR', dateOptions);
  const dateFormater = formatter.format(date)
  return dateFormater.at(0).toUpperCase() + dateFormater.slice(1) 
}
