/**
 * Pizzadeig.is — Cloud Functions for Notifications
 * 
 * SETUP INSTRUCTIONS:
 * 1. Run: firebase init functions (choose TypeScript)
 * 2. Copy this file to functions/src/notificationTriggers.ts
 * 3. Import and export from functions/src/index.ts
 * 4. Deploy: firebase deploy --only functions
 */

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

if (!admin.apps.length) admin.initializeApp();
const db = admin.firestore();

/**
 * When a new review is created, notify the recipe/restaurant owner.
 */
export const onReviewCreate = functions.firestore
  .document('reviews/{reviewId}')
  .onCreate(async (snap, context) => {
    const review = snap.data();
    const targetType = review.target_type; // 'recipe' | 'restaurant'
    const targetId = review.target_id;

    // Look up the owner/author
    let ownerUid: string | null = null;
    
    if (targetType === 'recipe') {
      const recipeDoc = await db.doc(`recipes/${targetId}`).get();
      ownerUid = recipeDoc.data()?.author_uid || null;
    } else if (targetType === 'restaurant') {
      const restDoc = await db.doc(`restaurants/${targetId}`).get();
      ownerUid = restDoc.data()?.owner_uid || null;
    }

    if (!ownerUid || ownerUid === review.author_uid) return; // Don't notify self

    await db.collection('notifications').add({
      user_uid: ownerUid,
      type: 'new_review',
      title_is: 'Ný umsögn!',
      title_en: 'New review!',
      body_is: `${review.author_name} gaf ${review.rating} pizzur einkunn.`,
      body_en: `${review.author_name} gave a ${review.rating} pizza rating.`,
      read: false,
      link: `/${targetType === 'recipe' ? 'uppskriftir' : 'stadir'}/${targetId}`,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

/**
 * When someone follows a user, notify them.
 */
export const onFollowCreate = functions.firestore
  .document('follows/{followId}')
  .onCreate(async (snap) => {
    const follow = snap.data();

    await db.collection('notifications').add({
      user_uid: follow.followed_uid,
      type: 'new_follower',
      title_is: 'Nýr fylgjandi!',
      title_en: 'New follower!',
      body_is: `${follow.follower_name} fylgir þér nú.`,
      body_en: `${follow.follower_name} is now following you.`,
      read: false,
      link: `/notandi/${follow.follower_uid}`,
      created_at: admin.firestore.FieldValue.serverTimestamp(),
    });
  });

/**
 * Dough planner reminder — scheduled function.
 * Checks dough_plans for upcoming steps and sends notifications.
 * Run every 15 minutes.
 */
export const doughPlannerReminder = functions.pubsub
  .schedule('every 15 minutes')
  .onRun(async () => {
    const now = new Date();
    const fifteenMinLater = new Date(now.getTime() + 15 * 60 * 1000);

    const plansSnap = await db.collection('dough_plans')
      .where('next_step_at', '>=', now)
      .where('next_step_at', '<=', fifteenMinLater)
      .where('reminder_sent', '==', false)
      .get();

    const batch = db.batch();

    for (const planDoc of plansSnap.docs) {
      const plan = planDoc.data();

      // Create notification
      const notifRef = db.collection('notifications').doc();
      batch.set(notifRef, {
        user_uid: plan.user_uid,
        type: 'dough_reminder',
        title_is: 'Deigstýring áminning! 🍕',
        title_en: 'Dough Planner reminder! 🍕',
        body_is: plan.next_step_is || 'Tími til að athuga deigið!',
        body_en: plan.next_step_en || 'Time to check your dough!',
        read: false,
        link: '/deigreiknivel',
        created_at: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Mark reminder as sent
      batch.update(planDoc.ref, { reminder_sent: true });
    }

    await batch.commit();
    console.log(`Sent ${plansSnap.size} dough reminders.`);
  });
