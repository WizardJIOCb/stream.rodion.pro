import { ExternalLink, Code, Gamepad2, MessageCircle, Zap } from 'lucide-react';
import { Button } from '@frontend/components/ui/button';
import { KICK_CHANNEL_URL } from '@frontend/lib/constants';
import { trackKickChannelClick } from '@frontend/lib/analytics';

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-6 space-y-8">
      <div>
        <p className="hud-label">О канале</p>
        <h1 className="font-heading font-bold text-4xl text-text-primary mt-1">WizardJIOCb</h1>
        <p className="text-primary font-heading text-lg mt-2">Stream Command Center</p>
      </div>

      <div className="glass-panel p-6 space-y-4">
        <p className="text-text-secondary leading-relaxed text-lg">
          Я — Родион. Разработчик, геймер, стример на Kick. Мои стримы — это не фоновый шум.
          Это интерактивные вечера, где чат управляет происходящим. Зрители выбирают ответы в
          диалогах, запускают челленджи, саботируют билды и делают ставки на исход.
        </p>
        <p className="text-text-secondary leading-relaxed">
          Я разбираю игры как разработчик: почему дизайнер сделал именно так, где баг, где
          гениальное решение. Честно, технично, иногда жёстко. Если ищешь стрим без фальши —
          ты по адресу.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[
          { icon: Gamepad2, title: 'Интерактивные прохождения', desc: 'Зрители влияют на всё: от диалогов до состава отряда. Channel Points — это реальная валюта влияния.' },
          { icon: Code, title: 'Dev-разборы', desc: 'Разбираю механики, UX-решения и баги как профессиональный разработчик. Не просто играю — анализирую.' },
          { icon: MessageCircle, title: 'Живой чат', desc: 'Никаких ботов и фейковой активности. Реальные зрители, реальные взаимодействия, реальный хаос.' },
          { icon: Zap, title: 'Спонтанные стримы', desc: 'Нет жёсткого расписания. Стримлю когда горит. Следи за сайтом или Kick — узнаешь первым.' },
        ].map(({ icon: Icon, title, desc }) => (
          <div key={title} className="glass-panel-hover p-5 space-y-3">
            <Icon className="w-6 h-6 text-primary" />
            <h3 className="font-heading font-semibold text-text-primary">{title}</h3>
            <p className="text-sm text-text-secondary">{desc}</p>
          </div>
        ))}
      </div>

      <div className="text-center">
        <a href={KICK_CHANNEL_URL} target="_blank" rel="noopener noreferrer" onClick={trackKickChannelClick}>
          <Button size="lg">
            Присоединиться на Kick
            <ExternalLink className="w-4 h-4 ml-1" />
          </Button>
        </a>
      </div>
    </div>
  );
}
