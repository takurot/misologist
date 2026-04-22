import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import HomePage from '@/app/page';
import { LocaleProvider } from '@/components/LocaleProvider';
import { LanguageToggle } from '@/components/LanguageToggle';
import { resolveLocale } from '@/lib/i18n';

describe('locale switching', () => {
  it('defaults to English when locale is missing or invalid', () => {
    expect(resolveLocale(undefined)).toBe('en');
    expect(resolveLocale('invalid')).toBe('en');
    expect(resolveLocale('ja')).toBe('ja');
  });

  it('renders the homepage in English by default', () => {
    render(
      <LocaleProvider initialLocale="en">
        <HomePage />
      </LocaleProvider>
    );

    expect(
      screen.getByRole('heading', { level: 1, name: /Turn fermentation into science\./i })
    ).toBeInTheDocument();
    expect(screen.getByText(/Start diagnosis/i)).toBeInTheDocument();
  });

  it('switches the UI to Japanese and persists the choice', async () => {
    const user = userEvent.setup();

    render(
      <LocaleProvider initialLocale="en">
        <LanguageToggle />
        <HomePage />
      </LocaleProvider>
    );

    await user.click(screen.getByRole('button', { name: /日本語/i }));

    expect(
      screen.getByRole('heading', { level: 1, name: /発酵を、/i })
    ).toBeInTheDocument();
    expect(screen.getByText(/診断を開始する/i)).toBeInTheDocument();
    expect(window.localStorage.getItem('misologist-locale')).toBe('ja');
    expect(document.cookie).toContain('misologist-locale=ja');
  });
});
