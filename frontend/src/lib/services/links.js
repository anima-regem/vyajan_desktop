import { db } from '../firebase';
import { collection, query, where, addDoc, getDocs, updateDoc, doc, serverTimestamp, deleteDoc, getDoc } from 'firebase/firestore';

export const addLink = async (userId, url, metadata) => {
    try {
        const linkData = {
            url,
            userId,
            createdAt: serverTimestamp(),
            isArchived: false,
            isPermanent: false,
            metadataDescription: metadata.description || '',
            metadataImage: metadata.image || '',
            metadataTitle: metadata.title || '',
            title: metadata.title || url
        };

        const docRef = await addDoc(collection(db, 'links'), linkData);
        return { id: docRef.id, ...linkData };
    } catch (error) {
        console.error('Error adding link:', error);
        throw error;
    }
};

export const getUserLinks = async (userId) => {
    try {
        const q = query(
            collection(db, 'links'),
            where('userId', '==', userId)
        );
        
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
    } catch (error) {
        console.error('Error getting user links:', error);
        throw error;
    }
};

export const getLinkById = async (linkId) => {
    try {
        const linkRef = doc(db, 'links', linkId);
        const linkSnap = await getDoc(linkRef);
        
        if (linkSnap.exists()) {
            return { id: linkSnap.id, ...linkSnap.data() };
        }
        throw new Error('Link not found');
    } catch (error) {
        console.error('Error getting link:', error);
        throw error;
    }
};

export const updateLinkStatus = async (linkId, { isArchived, isPermanent }) => {
    try {
        const linkRef = doc(db, 'links', linkId);
        const updates = {};
        
        if (isArchived !== undefined) updates.isArchived = isArchived;
        if (isPermanent !== undefined) updates.isPermanent = isPermanent;
        
        await updateDoc(linkRef, updates);
        return { id: linkId, ...updates };
    } catch (error) {
        console.error('Error updating link status:', error);
        throw error;
    }
};

export const deleteLink = async (linkId) => {
    try {
        const linkRef = doc(db, 'links', linkId);
        await deleteDoc(linkRef);
        return linkId;
    } catch (error) {
        console.error('Error deleting link:', error);
        throw error;
    }
};
