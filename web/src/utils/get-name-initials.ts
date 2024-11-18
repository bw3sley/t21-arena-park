export function getNameInitials(fullName: string | null) {
  if (fullName) {
    const names = fullName.trim().split(/\s+/)
  
    if (names.length === 1) {
      return names[0][0].toUpperCase()
    }
  
    const firstInitial = names[0][0].toUpperCase()
    const lastInitial = names[names.length - 1][0].toUpperCase()
  
    return `${firstInitial}${lastInitial}`
  }

  return fullName;
}