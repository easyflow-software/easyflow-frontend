'use client';
import i18nConfig from '@/i18n.config';
import { ParamsType } from '@/src/types/params.type';
import { Button, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from '@nextui-org/react';
import { CaretDown } from '@phosphor-icons/react';
import { usePathname, useRouter } from 'next/navigation';
import { FunctionComponent, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

const LangSwitcher: FunctionComponent<ParamsType> = ({ params: { locale } }): ReactElement => {
  const { t } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();

  const [isOpen, setIsOpen] = useState(false);

  return (
    <Dropdown onOpenChange={setIsOpen}>
      <DropdownTrigger>
        <Button
          endContent={
            <CaretDown className={`${isOpen ? 'rotate-180' : ''} transform-gpu transition-transform duration-300`} />
          }
          variant="light"
        >
          {locale.toUpperCase()}
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
        {i18nConfig.locales
          .filter(lang => lang !== locale)
          .map(lang => (
            <DropdownItem
              key={lang}
              onClick={() => {
                router.replace(pathname.replace(`/${locale}`, `/${lang}`));
              }}
            >
              {t(`navbar:lang.${lang}`)}
            </DropdownItem>
          ))}
      </DropdownMenu>
    </Dropdown>
  );
};

export default LangSwitcher;
