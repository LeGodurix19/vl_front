// Utilitaires pour la validation des ISBN

export const validateISBN = (isbn: string): boolean => {
  // Nettoyer l'ISBN (supprimer espaces, tirets, etc.)
  const cleanISBN = isbn.replace(/[\s-]/g, '');
  
  // Vérifier si c'est un ISBN-10 ou ISBN-13
  if (cleanISBN.length === 10) {
    return validateISBN10(cleanISBN);
  } else if (cleanISBN.length === 13) {
    return validateISBN13(cleanISBN);
  }
  
  return false;
};

const validateISBN10 = (isbn: string): boolean => {
  // ISBN-10 doit contenir 9 chiffres + 1 chiffre de contrôle (ou X)
  if (!/^[0-9]{9}[0-9X]$/i.test(isbn)) {
    return false;
  }
  
  let sum = 0;
  for (let i = 0; i < 9; i++) {
    sum += parseInt(isbn[i], 10) * (10 - i);
  }
  
  const checkDigit = isbn[9].toUpperCase();
  const calculatedCheck = (11 - (sum % 11)) % 11;
  
  if (calculatedCheck === 10) {
    return checkDigit === 'X';
  } else {
    return checkDigit === calculatedCheck.toString();
  }
};

const validateISBN13 = (isbn: string): boolean => {
  // ISBN-13 doit contenir exactement 13 chiffres
  if (!/^[0-9]{13}$/.test(isbn)) {
    return false;
  }
  
  let sum = 0;
  for (let i = 0; i < 12; i++) {
    const digit = parseInt(isbn[i], 10);
    sum += i % 2 === 0 ? digit : digit * 3;
  }
  
  const checkDigit = parseInt(isbn[12]);
  const calculatedCheck = (10 - (sum % 10)) % 10;
  
  return checkDigit === calculatedCheck;
};

export const formatISBN = (isbn: string): string => {
  const cleanISBN = isbn.replace(/[\s-]/g, '');
  
  if (cleanISBN.length === 10) {
    // Format ISBN-10: X-XXX-XXXXX-X
    return `${cleanISBN.slice(0, 1)}-${cleanISBN.slice(1, 4)}-${cleanISBN.slice(4, 9)}-${cleanISBN.slice(9)}`;
  } else if (cleanISBN.length === 13) {
    // Format ISBN-13: XXX-X-XXX-XXXXX-X
    return `${cleanISBN.slice(0, 3)}-${cleanISBN.slice(3, 4)}-${cleanISBN.slice(4, 7)}-${cleanISBN.slice(7, 12)}-${cleanISBN.slice(12)}`;
  }
  
  return isbn;
};