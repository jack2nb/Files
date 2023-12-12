import * as mo from 'movy';

const t1 = mo.addTex('a+b=c', { scale: 0.5 }).wipeIn({ t: 0 });
const t2 = mo.addTex('\\sqrt{a^2+1}', { scale: 0.5 });
//2个字留白
const t3 = mo.addTex(`
 
\\begin{split}
\\color{yellowgreen} 
sdafasdf\\quad sdafasdf\\\\
sdafasdf\\qquad sdafasdf \\\\
sdafasdf\\hspace{1em} vvvvsdafasdf\\
\\end{split}
 
`, {
  scale: 0.5,
});

t1.transformTexTo(t2, { t: 2, duration: 1 });
t2.transformTexTo(t3, { t: 4, duration: 1 });
