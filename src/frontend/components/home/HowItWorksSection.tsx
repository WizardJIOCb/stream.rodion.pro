import { MessageCircle, Coins, Gamepad2, Flame } from 'lucide-react';

const steps = [
  {
    num: 1,
    icon: MessageCircle,
    title: 'Заходи в чат на Kick',
    desc: 'Жми на Kick, подключайся к чату. Это бесплатно.',
    example: 'kick.com/wizardjiocb',
  },
  {
    num: 2,
    icon: Coins,
    title: 'Копи Points — трать на действия',
    desc: 'За просмотр стрима ты получаешь Channel Points. Трать их на награды.',
    example: '+50 Points каждые 5 минут',
  },
  {
    num: 3,
    icon: Gamepad2,
    title: 'Влияй на сюжет стрима',
    desc: 'Голосуй, делай ставки, активируй награды. В Mass Effect — выбирай ответы Шепарда.',
    example: 'Награда: "Выбери ответ Шепарда" — 500 Points',
  },
  {
    num: 4,
    icon: Flame,
    title: 'Запускай хаос и челленджи',
    desc: 'Награды вроде "Без медигеля 10 минут" или "Бой без укрытий" делают стрим непредсказуемым.',
    example: 'Чем больше хаоса — тем веселее',
  },
];

export default function HowItWorksSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-primary rounded-full" />
        <div>
          <p className="hud-label">Как это работает</p>
          <h2 className="section-title">Как участвовать</h2>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {steps.map((step) => (
          <div key={step.num} className="glass-panel-hover p-4 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-primary-dim flex items-center justify-center text-primary font-heading font-bold text-sm">
                {step.num}
              </div>
              <step.icon className="w-5 h-5 text-primary" />
            </div>
            <h3 className="font-heading font-semibold text-sm text-text-primary">
              {step.title}
            </h3>
            <p className="text-xs text-text-secondary leading-relaxed">
              {step.desc}
            </p>
            <p className="text-[10px] text-text-muted font-heading uppercase tracking-wider">
              {step.example}
            </p>
          </div>
        ))}
      </div>
    </section>
  );
}
