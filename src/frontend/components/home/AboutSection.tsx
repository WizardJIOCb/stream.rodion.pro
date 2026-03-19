import { User, Gamepad2, Code, MessageCircle } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-3">
        <div className="w-1 h-6 bg-primary rounded-full" />
        <div>
          <p className="hud-label">О стриме</p>
          <h2 className="section-title">WizardJIOCb</h2>
        </div>
      </div>

      <div className="glass-panel p-6 space-y-4">
        <p className="text-text-secondary leading-relaxed">
          Здесь не просто стримы. Это интерактивные вечера, где зрители управляют происходящим.
          Я разработчик и геймер, который разбирает игры как с точки зрения игрока, так и с точки
          зрения создателя. Честно, технично, с хаосом в чате.
        </p>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { icon: Gamepad2, label: 'Интерактивные прохождения', desc: 'Чат решает' },
            { icon: Code, label: 'Dev-разборы', desc: 'Глазами разработчика' },
            { icon: MessageCircle, label: 'Живой чат', desc: 'Без фейка' },
            { icon: User, label: 'Честные обзоры', desc: 'Brutal honest' },
          ].map(({ icon: Icon, label, desc }) => (
            <div key={label} className="text-center space-y-1.5 py-3">
              <Icon className="w-6 h-6 text-primary mx-auto" />
              <p className="text-xs font-heading font-medium text-text-primary">{label}</p>
              <p className="text-[10px] text-text-muted">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
