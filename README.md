# מחשבון הצעות מחיר לנגרות — הוראות העלאה לאוויר

3 שירותים, כולם בחינם ברמה הבסיסית: **GitHub** (קוד), **Vercel** (אחסון + שרת קטן), **Supabase** (מסד נתונים).

## שלב 1 — GitHub

```bash
cd carpentry-deploy
git init
git add .
git commit -m "Initial commit"
```

צור repo חדש (ריק, בלי README) ב-github.com, ואז:

```bash
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

## שלב 2 — Supabase (מסד הנתונים)

1. ב-[supabase.com](https://supabase.com) → New Project (בחר שם + סיסמה, שמור את הסיסמה).
2. בתפריט השמאלי → **SQL Editor** → New query → הדבק את כל התוכן של `supabase-schema.sql` → Run.
3. בתפריט השמאלי → **Settings → API** → העתק:
   - **Project URL**
   - **anon public key**
4. פתח את `index.html`, חפש בתחילת ה-`<script>` את:
   ```js
   const SUPABASE_URL = "YOUR_SUPABASE_PROJECT_URL";
   const SUPABASE_ANON_KEY = "YOUR_SUPABASE_ANON_KEY";
   ```
   והחלף בערכים האמיתיים שלך. שמור, ואז:
   ```bash
   git add index.html
   git commit -m "Add Supabase config"
   git push
   ```

**הערה חשובה על אבטחה:** האפליקציה הזו עדיין בלי מערכת התחברות (זה MVP ליחיד). מדיניות ה-RLS ב-`supabase-schema.sql` פתוחה לכל מי שיש לו את ה-URL וה-anon key שלך. זה בסדר לשימוש אישי, אבל **לפני שאתה נותן את הכלי לנגרים אחרים**, צריך להוסיף התחברות אמיתית (Supabase Auth) כדי שכל נגר יראה רק את הנתונים שלו.

## שלב 3 — Vercel (העלאה + מפתח ה-AI)

1. ב-[vercel.com](https://vercel.com) → **Add New → Project** → בחר את ה-repo מ-GitHub.
2. השאר את כל ההגדרות כברירת מחדל (אין Build Command, אין Output Directory — זה סטטי).
3. לפני שלוחצים Deploy: **Environment Variables** → הוסף:
   - Key: `ANTHROPIC_API_KEY`
   - Value: המפתח שלך מ-[console.anthropic.com](https://console.anthropic.com) → API Keys
4. לחץ **Deploy**. אחרי דקה תקבל URL חי כמו `carpentry-quotes.vercel.app`.

### על "AI בחינם" — המצב האמיתי

אין ל-Anthropic (או לכל ספק AI רציני אחר) API בחינם לצמיתות בהיקף שיתאים למוצר אמיתי. מה שכן קיים:

- **$5 קרדיט חד-פעמי** לחשבון API חדש (בתוקף כ-30-90 יום, תלוי בתנאים העדכניים).
- אני כבר עדכנתי את הקוד להשתמש ב-**Haiku** (המודל הזול ביותר) להערכת שטח מהירה ולניסוח תזכורות גביה, ורק בפירוק החלקים המלא (המשימה המורכבת יותר) נשאר Sonnet. זה מוזיל את העלות משמעותית.
- עלות בפועל: כמה **סנטים בודדים** לכל ניתוח תמונה עם Haiku, קצת יותר עם Sonnet. גם 200-300 שימושים בחודש נשארים בטווח של כמה דולרים.

**האסטרטגיה שאני ממליץ עליה כדי לצאת לשיווק היום ב-0 עלות בפועל:**

1. **תעלה עכשיו בלי `ANTHROPIC_API_KEY`** (פשוט אל תגדיר את משתנה הסביבה ב-Vercel). כל המוצר עובד מצוין בלי זה — הצעות מחיר, דוח חיתוך, מעקב הזמנות, גביה — הכל מבוסס הזנה ידנית. רק כפתורי ה-AI (ניתוח תמונה, ניסוח תזכורת) לא יעבדו, ופשוט יציגו הודעת שגיאה עדינה.
2. **תתחיל לשווק ולגייס משתמשים ראשונים** על הגרסה הזו — המוצר הליבה שלם ושימושי בלעדה.
3. **כשיש לך משתמש משלם ראשון** (או אפילו כשאתה רוצה להדגים AI בפגישת מכירה), תוסיף את `ANTHROPIC_API_KEY` עם הקרדיט החינמי, ותגדיר **Usage Limit** בקונסולת Anthropic (Settings → Limits) על סכום נמוך כמו $5-10, כדי שלעולם לא תחויב מעבר לזה בלי לשים לב.
4. ברגע שיש הכנסה מהמנויים, ה-AI ממומן מעצמו — התמחור שדנו עליו קודם ($15-40 לחודש ללקוח) מכסה בנוחות עלות AI של אגורות בודדות לשימוש.

זו הדרך הכי ריאלית "לקבל AI בחינם" — לא כי הוא חינמי לצמיתות, אלא כי אתה משתמש בו בזהירות, מתחיל בלעדיו, ומוסיף אותו כשההכנסה כבר מכסה את העלות.

## אחרי זה

- כל שינוי: ערוך קובץ → `git add . && git commit -m "..." && git push` → Vercel מעדכן אוטומטית תוך שניות.
- דומיין אישי (כמו `nagarut-david.co.il`): Vercel → Project Settings → Domains.
- לבדוק שהכל עובד: פתח את ה-URL בנייד, נסה ליצור הצעת מחיר, תעלה תמונה, תבדוק שההדפסה עובדת (כאן זה כן יעבוד, בניגוד לתצוגה בצ'אט).
