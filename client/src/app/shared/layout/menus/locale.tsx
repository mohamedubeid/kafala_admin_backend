import React from 'react';
import { Button, DropdownItem } from 'reactstrap';
import { NavDropdown } from './menu-components';
import { locales, languages } from 'app/config/translation';

export const LocaleMenu = ({ currentLocale, onClick }: { currentLocale: string; onClick: (event: any) => void }) =>
  Object.keys(languages).length > 1 ? (
    // <NavDropdown icon="flag" name={currentLocale ? languages[currentLocale].name : undefined}>
    //   {locales.map(locale => (
    //     <DropdownItem key={locale} value={locale} onClick={onClick}>
    //       {languages[locale].name}
    //     </DropdownItem>
    //   ))}
    // </NavDropdown>
    <Button className='lang-btn' onClick={onClick}>
      <span>{currentLocale == 'en' ? languages['ar-ly']?.name : languages['en']?.name }</span>
      <span><img src='/content/images/lang.svg' alt='lang' /></span>
    </Button>
  ) : null;
