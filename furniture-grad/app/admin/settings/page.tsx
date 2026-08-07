import { getSettings, updateSettings } from '@/actions/settings';
import { getContacts, createContact } from '@/actions/contacts';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ImageCropField } from '@/components/image-crop-field';
import { ContactRow } from '@/components/admin/contact-row';
import { ToastForm } from '@/components/admin/toast-form';

export default async function AdminSettingsPage() {
  const [settings, contacts] = await Promise.all([getSettings(), getContacts()]);

  return (
    <div className="flex flex-col gap-10">
      <div>
        <h1 className="text-3xl font-bold text-[#2c3e50] mb-8">Настройки магазина</h1>

        <ToastForm action={updateSettings} toastLabel="Сохраняем настройки…" className="bg-white p-6 rounded-2xl shadow grid gap-5 max-w-[500px]">
          <div>
            <label className="text-sm text-[#7f8c8d] block mb-1">Название магазина</label>
            <Input name="shop_name" placeholder="АртВуд" defaultValue={settings.shop_name} required />
          </div>

          <ImageCropField
            name="hero_image_file"
            label="Фон главного баннера"
            aspect={1600 / 500}
            hint="Рекомендуемое соотношение сторон — как у широкого баннера (примерно 1600×500)."
            defaultPreview={settings.hero_image || null}
            removable
          />

          <Button type="submit" className="w-fit">Сохранить</Button>
        </ToastForm>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-[#2c3e50] mb-4">Контакты продавца</h2>
        <p className="text-[#7f8c8d] mb-6 max-w-[500px]">
          Добавьте любые способы связи — телефон, Instagram, Viber, что угодно.
          Ссылка необязательна: если её не указать, покупатель просто увидит текст.
        </p>

        <ToastForm action={createContact} toastLabel="Добавляем контакт…" className="bg-white p-6 rounded-2xl shadow mb-6 grid gap-4 max-w-[500px]">
          <div>
            <label className="text-sm text-[#7f8c8d] block mb-1">Подпись</label>
            <Input name="label" placeholder="Например, Телефон или Instagram" required />
          </div>
          <div>
            <label className="text-sm text-[#7f8c8d] block mb-1">Значение</label>
            <Input name="value" placeholder="+7 900 000-00-00 или @username" required />
          </div>
          <div>
            <label className="text-sm text-[#7f8c8d] block mb-1">Ссылка (необязательно)</label>
            <Input name="href" placeholder="tel:+79000000000, mailto:..., https://..." />
          </div>
          <Button type="submit" className="w-fit">Добавить контакт</Button>
        </ToastForm>

        <div className="bg-white rounded-2xl shadow overflow-hidden max-w-[500px]">
          {contacts.length === 0 ? (
            <div className="p-6 text-center text-[#95a5a6]">Контактов пока нет</div>
          ) : (
            contacts.map(c => (
              <ContactRow key={c.id} contact={c} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
