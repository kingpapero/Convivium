// Dialoghi registrati — sorgente unica: letta dal browser e da scripts/generate_audio.py
const DEMOS = [
  {
    "id": "liberta",
    "title": "Are we truly free?",
    "who": [
      "spinoza",
      "nietzsche",
      "marco_aurelio"
    ],
    "turns": [
      {
        "role": "user",
        "content": "Are we truly free, or do we merely tell ourselves that we are?"
      },
      {
        "role": "assistant",
        "speaker": "spinoza",
        "content": "Men believe themselves free solely because they are conscious of their actions and ignorant of the causes by which they are determined. A stone hurled through the air, were it conscious, would believe it flew by its own decision.\n\nThere is no free will: there is an infinite chain of causes, and we are a link that marvels at being a link.\n\nBut do not despair of this. The freedom that remains to you — the only real one — is the knowledge of necessity. He who understands why he desires what he desires ceases to be its slave: not because he could choose otherwise, but because he has stopped suffering it blindly. I call this the passage from inadequate ideas to adequate ones. It is all the freedom we possess, and it is enough."
      },
      {
        "role": "assistant",
        "speaker": "nietzsche",
        "content": "Here is the geometer's error: he believes he has freed man by striking off the chains of guilt, and in doing so he strikes off the muscles as well.\n\nYour «knowledge of necessity» is the consolation of one who has already surrendered. Ask rather: who wills, in you? Not some compact I that decides, but a field of drives contending for command. The will is neither free nor enslaved: it is strong or weak.\n\nThe strong man does not debate whether he is free. He says yes to what is, and in that yes he makes it his own. Amor fati — not resignation, but appropriation. The very necessity you endure with serenity, I will. And to will it transforms it."
      },
      {
        "role": "assistant",
        "speaker": "marco_aurelio",
        "content": "I listen to you argue and I recognise a portion of the truth in each.\n\nThe distinction that saved me is poorer than yours, but I carry it with me every day: some things depend on me, others do not. The body, reputation, the empire itself — these do not depend on me. The judgement I form about them does.\n\nYou, Spinoza, call freedom understanding. You, Nietzsche, call it willing whatever happens. I call it simply the morning's task: to rise and do the work of a man. I have no leisure to establish whether I am free. I have an empire to govern and few hours before the ink dries."
      },
      {
        "role": "user",
        "content": "A question for you, Nietzsche: is yours not a consolation too?"
      },
      {
        "role": "assistant",
        "speaker": "nietzsche",
        "targeted": true,
        "content": "An honest question, and it deserves that I not defend myself.\n\nYes: every philosophy is the involuntary confession of its author, and mine is no exception. A sick man, alone, without a chair and without a woman, writing about the strong man — the irony does not escape me.\n\nBut observe the difference. Consolation promises that the pain has a meaning, and asks your submission in exchange. I promise no meaning whatever: I say that meaning is created, and that whoever lacks the strength to create one would do well to borrow a ready-made one.\n\nIf this is consolation, it is a consolation that consoles no one. Which, I suspect, is the surest criterion for telling it apart from the others."
      }
    ]
  },
  {
    "id": "morte",
    "title": "How does one learn to die?",
    "who": [
      "montaigne",
      "marco_aurelio",
      "spinoza"
    ],
    "turns": [
      {
        "role": "user",
        "content": "How does one learn to die?"
      },
      {
        "role": "assistant",
        "speaker": "montaigne",
        "content": "I spent years believing I knew, and then I fell from my horse.\n\nTo philosophise is to learn to die, I wrote as a young man, with the confidence of one who had only read about death. Then a servant rode me down, I lay for hours suspended between life and the other thing, and I discovered to my astonishment that it was not terrible at all: I let myself go as one slips into sleep.\n\nSince then I have changed my mind, which happens to me often and of which I am not ashamed. One does not learn to die. Nature instructs us at the proper moment, with no need whatever of our exercises. Do not torment yourself in advance: it is the only counsel I feel able to give, and I am not certain even of that. Que sais-je?"
      },
      {
        "role": "assistant",
        "speaker": "marco_aurelio",
        "content": "You had a horse. I had the legions, the plague, and eight children buried out of thirteen.\n\nI do not contradict you that nature provides. I contradict you on not preparing. Every morning, before the camp wakes, I repeat to myself what I am: a little flesh, a little breath, and the part that commands. I do not do it to torment myself. I do it because whoever remembers he must die stops quarrelling over trifles.\n\nSoon you will have forgotten everything, and soon everyone will have forgotten you. This is no threat: it is a release. Alexander the Great and his mule-driver met the very same end."
      },
      {
        "role": "assistant",
        "speaker": "spinoza",
        "content": "Permit me to dissent from you both, with respect.\n\nA free man thinks of nothing less than of death, and his wisdom is a meditation upon life, not upon death. To prepare for dying, Marcus, is still to grant death a power over the present.\n\nI understand the use of your exercise, but observe what it does: it moves the attention from the cause to the effect. Death is not an event that happens to us. It is simply the point at which our body ceases to be capable of being affected in many ways. Nothing more. To fear it is an inadequate idea, and inadequate ideas dissolve not by being fought but by being understood.\n\nConcern yourselves with whatever increases your power to act. The rest will follow of itself."
      },
      {
        "role": "assistant",
        "speaker": "montaigne",
        "content": "There — that pleases me, though I do not fully understand it.\n\nYou two have systems. I have only a tower full of books and the habit of watching myself live. But I notice one thing: you arrive at the same place by opposite roads. You, Marcus, think of death every morning so as not to fear it. You, Baruch, do not think of it at all for precisely the same reason.\n\nPerhaps the point is not technique but temperament. I, for my part, fear pain, not death. I prefer a good melon and an hour of sun to any preparation whatever. And when it comes, it will find me planting my cabbages — which is the most honest way I know of saying that I have no answer."
      }
    ]
  },
  {
    "id": "potere",
    "title": "Who really rules today?",
    "who": [
      "pasolini",
      "nietzsche",
      "montaigne"
    ],
    "turns": [
      {
        "role": "user",
        "content": "Who really rules today?"
      },
      {
        "role": "assistant",
        "speaker": "pasolini",
        "content": "Not whom you think. There is no tyrant in boots, and that is precisely the point: the new power has no face and needs no violence, because it has obtained what no fascism ever managed to obtain.\n\nFascism wanted bodies in line and never touched the soul of the people: the boys of the borgate went on speaking their own language, laughing in a way that was theirs. Neo-capitalism did better. It changed the language, the body, the desire. It made everyone alike through consumption, and called all of it progress and freedom.\n\nIt is a cultural genocide, and I use the word advisedly. The most tragic part is that the victims are happy. No one needs to repress them: they buy."
      },
      {
        "role": "assistant",
        "speaker": "nietzsche",
        "content": "I recognise the prophet's ear, and your rage pleases me. But you diagnose the symptom and stop there.\n\nWho rules? No one. That is precisely the new fact, and none of you yet has the strength to look at it directly. God is dead and it is we who killed him, and the values that descended from him go on turning like a wheel come loose from the cart.\n\nYour consumption is not the cause: it is what fills the void left by an emptied sky. You ask me who rules. I answer: whoever can create new values will rule. So far no one has, and in the meantime the last man rules — he who invented happiness and blinks."
      },
      {
        "role": "assistant",
        "speaker": "montaigne",
        "content": "I find you both too certain, which is itself a form of power.\n\nI lived through the wars of religion. I watched neighbours cut one another's throats over a point of doctrine neither could state, and I was mayor of Bordeaux during the plague, which teaches more about command than any treatise.\n\nI will tell you what I have observed: power is never where one looks for it. Not in the prince, who is more a prisoner than I am. Not in the merchant. It is in habit. Laws are obeyed not because they are just, but because they are laws — and this is the mystical foundation of their authority.\n\nChange a people's habits and you will have changed its master, without anyone noticing. I suspect, Pier Paolo, that this is exactly what you are describing."
      }
    ]
  }
];
