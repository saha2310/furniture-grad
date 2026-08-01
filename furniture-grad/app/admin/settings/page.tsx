import { getSettings, updateSettings } from '@/actions/settings';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

export default async function AdminSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#2c3e50] mb-8">Контакты продавца</h1>
      <p className="text-[#7f8c8d] mb-6 max-w-[500px]">
        Эти данные видит покупатель, когда нажимает кнопку «Связаться с продавцом».
        Оставьте поле пустым, если этот способ связи не нужен.
      </p>

      <form action={updateSettings} className="bg-white p-6 rounded-2xl shadow grid gap-4 max-w-[500px]">
        <div>
          <label className="text-sm text-[#7f8c8d] block mb-1">Имя / название</label>
          <Input name="seller_name" placeholder="МебельГрад" defaultValue={settings.seller_name} />
        </div>
        <div>
          <label className="text-sm text-[#7f8c8d] block mb-1">Телефон</label>
          <Input name="seller_phone" placeholder="+7 900 000-00-00" defaultValue={settings.seller_phone} />
        </div>
        <div>
          <label className="text-sm text-[#7f8c8d] block mb-1">Email</label>
          <Input name="seller_email" type="email" placeholder="info@example.com" defaultValue={settings.seller_email} />
        </div>
        <div>
          <label className="text-sm text-[#7f8c8d] block mb-1">Telegram</label>
          <Input name="seller_telegram" placeholder="@username или ссылка" defaultValue={settings.seller_telegram} />
        </div>
        <div>
          <label className="text-sm text-[#7f8c8d] block mb-1">WhatsApp</label>
          <Input name="seller_whatsapp" placeholder="+7 900 000-00-00" defaultValue={settings.seller_whatsapp} />
        </div>
        <Button type="submit" className="w-fit">Сохранить</Button>
      </form>
    </div>
  );
}
