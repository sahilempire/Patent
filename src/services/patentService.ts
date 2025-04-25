import { supabase } from '../lib/supabase';

export interface PatentData {
  inventionTitle: string;
  inventorNames: string;
  inventionType: string;
  briefSummary?: string;
  technicalField?: string;
  backgroundArt?: string;
  detailedDescription?: string;
  advantageousEffects?: string;
  claims: Array<{
    text: string;
    type: string;
    parentId?: string;
  }>;
  priorArtReferences: Array<{
    reference: string;
    type: string;
    relevance: string;
  }>;
}

export interface Patent {
  id: string;
  invention_title: string;
  inventor_names: string;
  invention_type: string;
  brief_summary?: string;
  technical_field?: string;
  background_art?: string;
  detailed_description?: string;
  advantageous_effects?: string;
  created_at: string;
  updated_at: string;
  claims?: Array<{
    id: string;
    patent_id: string;
    text: string;
    type: string;
    parent_id?: string;
    created_at: string;
  }>;
  prior_art_references?: Array<{
    id: string;
    patent_id: string;
    reference: string;
    type: string;
    relevance: string;
    created_at: string;
  }>;
}

// Type for raw data from Supabase
interface RawPatent {
  id: string;
  invention_title: string;
  inventor_names: string;
  invention_type: string;
  brief_summary?: string;
  technical_field?: string;
  background_art?: string;
  detailed_description?: string;
  advantageous_effects?: string;
  created_at: string;
  updated_at: string;
  user_id: string;
  status: string;
}

interface RawClaim {
  id: string;
  patent_id: string;
  text: string;
  type: string;
  parent_id?: string;
  created_at: string;
}

interface RawPriorArtReference {
  id: string;
  patent_id: string;
  reference: string;
  type: string;
  relevance: string;
  created_at: string;
}

export const patentService = {
  /**
   * Save a patent application to the database
   * @param patentData The patent data to save
   * @returns The saved patent with its ID
   */
  async savePatent(patentData: PatentData): Promise<Patent> {
    console.log('🔄 Starting patent save process');
    console.log('Patent data:', patentData);

    try {
      // Get current user
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError || !user) {
        console.error('❌ ERROR GETTING USER:', userError);
        throw new Error('User not authenticated');
      }
      
      // Prepare patent data
      const patentDataToSave = {
        ...patentData,
        user_id: user.id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      console.log('Prepared patent data:', patentDataToSave);

      // Insert patent
      console.log('Inserting patent into database...');
      const { data: savedPatent, error: patentError } = await supabase
        .from('patents')
        .insert(patentDataToSave)
        .select()
        .single();

      if (patentError) {
        console.error('❌ Error saving patent:', patentError);
        throw patentError;
      }
      console.log('✅ Patent saved successfully:', savedPatent);

      // Insert claims
      if (patentData.claims && patentData.claims.length > 0) {
        console.log('Saving claims...');
        const claimsData = patentData.claims.map(claim => ({
          ...claim,
          patent_id: savedPatent.id
        }));
        console.log('Prepared claims data:', claimsData);

        const { error: claimsError } = await supabase
          .from('claims')
          .insert(claimsData);

        if (claimsError) {
          console.error('❌ Error saving claims:', claimsError);
          throw claimsError;
        }
        console.log('✅ Claims saved successfully');
      }

      // Insert prior art references
      if (patentData.priorArtReferences && patentData.priorArtReferences.length > 0) {
        console.log('Saving prior art references...');
        const priorArtData = patentData.priorArtReferences.map(ref => ({
          ...ref,
          patent_id: savedPatent.id
        }));
        console.log('Prepared prior art data:', priorArtData);

        const { error: priorArtError } = await supabase
          .from('prior_art_references')
          .insert(priorArtData);

        if (priorArtError) {
          console.error('❌ Error saving prior art references:', priorArtError);
          throw priorArtError;
        }
        console.log('✅ Prior art references saved successfully');
      }

      // Fetch the complete patent with all related data
      const completePatent = await this.getPatentById(savedPatent.id);
      return completePatent;
    } catch (error) {
      console.error('❌ Error in savePatent:', error);
      throw error;
    }
  },

  /**
   * Get a patent by its ID
   * @param id The patent ID
   * @returns The patent with its claims and prior art references
   */
  async getPatentById(id: string): Promise<Patent> {
    try {
      console.log(`🔄 FETCHING PATENT FROM SUPABASE (ID: ${id})`);
      
      // Get patent data
      const { data: patent, error: patentError } = await supabase
        .from('patents')
        .select('*')
        .eq('id', id)
        .single();

      if (patentError) {
        console.error('❌ ERROR FETCHING PATENT:', patentError);
        throw patentError;
      }
      
      if (!patent) {
        console.error(`❌ PATENT NOT FOUND (ID: ${id})`);
        throw new Error('Patent not found');
      }
      
      console.log('✅ PATENT FETCHED SUCCESSFULLY:', patent);

      // Get claims
      console.log(`🔄 FETCHING CLAIMS FOR PATENT (ID: ${id})`);
      const { data: claims, error: claimsError } = await supabase
        .from('claims')
        .select('*')
        .eq('patent_id', id);

      if (claimsError) {
        console.error('❌ ERROR FETCHING CLAIMS:', claimsError);
        throw claimsError;
      }
      
      console.log(`✅ FETCHED ${claims?.length || 0} CLAIMS`);

      // Get prior art references
      console.log(`🔄 FETCHING PRIOR ART REFERENCES FOR PATENT (ID: ${id})`);
      const { data: references, error: referencesError } = await supabase
        .from('prior_art_references')
        .select('*')
        .eq('patent_id', id);

      if (referencesError) {
        console.error('❌ ERROR FETCHING PRIOR ART REFERENCES:', referencesError);
        throw referencesError;
      }
      
      console.log(`✅ FETCHED ${references?.length || 0} PRIOR ART REFERENCES`);

      // Convert raw data to Patent type
      const rawPatent = patent as unknown as RawPatent;
      const rawClaims = (claims || []) as unknown as RawClaim[];
      const rawReferences = (references || []) as unknown as RawPriorArtReference[];

      return {
        id: rawPatent.id,
        invention_title: rawPatent.invention_title,
        inventor_names: rawPatent.inventor_names,
        invention_type: rawPatent.invention_type,
        brief_summary: rawPatent.brief_summary,
        technical_field: rawPatent.technical_field,
        background_art: rawPatent.background_art,
        detailed_description: rawPatent.detailed_description,
        advantageous_effects: rawPatent.advantageous_effects,
        created_at: rawPatent.created_at,
        updated_at: rawPatent.updated_at,
        claims: rawClaims,
        prior_art_references: rawReferences
      };
    } catch (error) {
      console.error('❌ ERROR IN GET PATENT BY ID FUNCTION:', error);
      throw error;
    }
  },

  /**
   * Get all patents for a user
   * @param userId The user ID
   * @returns An array of patents
   */
  async getUserPatents(userId: string): Promise<Patent[]> {
    try {
      console.log(`🔄 FETCHING PATENTS FOR USER (ID: ${userId})`);
      
      const { data, error } = await supabase
        .from('patents')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('❌ ERROR FETCHING USER PATENTS:', error);
        throw error;
      }
      
      console.log(`✅ FETCHED ${data?.length || 0} PATENTS FOR USER`);
      
      // Convert raw data to Patent type
      const rawPatents = (data || []) as unknown as RawPatent[];
      return rawPatents.map(patent => ({
        id: patent.id,
        invention_title: patent.invention_title,
        inventor_names: patent.inventor_names,
        invention_type: patent.invention_type,
        brief_summary: patent.brief_summary,
        technical_field: patent.technical_field,
        background_art: patent.background_art,
        detailed_description: patent.detailed_description,
        advantageous_effects: patent.advantageous_effects,
        created_at: patent.created_at,
        updated_at: patent.updated_at
      }));
    } catch (error) {
      console.error('❌ ERROR IN GET USER PATENTS FUNCTION:', error);
      throw error;
    }
  },

  /**
   * Update an existing patent
   * @param id The patent ID
   * @param patentData The updated patent data
   * @returns The updated patent
   */
  async updatePatent(id: string, patentData: PatentData): Promise<Patent> {
    try {
      console.log(`🔄 UPDATING PATENT IN SUPABASE (ID: ${id}):`, patentData);
      
      // Update patent data
      const { data: patent, error: patentError } = await supabase
        .from('patents')
        .update({
          invention_title: patentData.inventionTitle,
          inventor_names: patentData.inventorNames,
          invention_type: patentData.inventionType,
          brief_summary: patentData.briefSummary,
          technical_field: patentData.technicalField,
          background_art: patentData.backgroundArt,
          detailed_description: patentData.detailedDescription,
          advantageous_effects: patentData.advantageousEffects,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single();

      if (patentError) {
        console.error('❌ ERROR UPDATING PATENT:', patentError);
        throw patentError;
      }
      
      if (!patent) {
        console.error(`❌ PATENT NOT FOUND FOR UPDATE (ID: ${id})`);
        throw new Error('Patent not found');
      }
      
      console.log('✅ PATENT UPDATED SUCCESSFULLY:', patent);

      // Delete existing claims and references
      console.log(`🔄 DELETING EXISTING CLAIMS AND REFERENCES FOR PATENT (ID: ${id})`);
      await supabase.from('claims').delete().eq('patent_id', id);
      await supabase.from('prior_art_references').delete().eq('patent_id', id);
      console.log('✅ EXISTING CLAIMS AND REFERENCES DELETED');

      // Insert updated claims
      if (patentData.claims.length > 0) {
        console.log(`🔄 SAVING ${patentData.claims.length} UPDATED CLAIMS TO SUPABASE`);
        
        const claimsToInsert = patentData.claims.map(claim => ({
          patent_id: id,
          text: claim.text,
          type: claim.type,
          parent_id: claim.parentId || null
        }));

        const { error: claimsError } = await supabase
          .from('claims')
          .insert(claimsToInsert);

        if (claimsError) {
          console.error('❌ ERROR SAVING UPDATED CLAIMS:', claimsError);
          throw claimsError;
        }
        
        console.log('✅ UPDATED CLAIMS SAVED SUCCESSFULLY');
      }

      // Insert updated prior art references
      if (patentData.priorArtReferences.length > 0) {
        console.log(`🔄 SAVING ${patentData.priorArtReferences.length} UPDATED PRIOR ART REFERENCES TO SUPABASE`);
        
        const referencesToInsert = patentData.priorArtReferences.map(ref => ({
          patent_id: id,
          reference: ref.reference,
          type: ref.type,
          relevance: ref.relevance
        }));

        const { error: referencesError } = await supabase
          .from('prior_art_references')
          .insert(referencesToInsert);

        if (referencesError) {
          console.error('❌ ERROR SAVING UPDATED PRIOR ART REFERENCES:', referencesError);
          throw referencesError;
        }
        
        console.log('✅ UPDATED PRIOR ART REFERENCES SAVED SUCCESSFULLY');
      }

      // Fetch the complete updated patent
      const updatedPatent = await this.getPatentById(id);
      return updatedPatent;
    } catch (error) {
      console.error('❌ ERROR IN UPDATE PATENT FUNCTION:', error);
      throw error;
    }
  },

  /**
   * Delete a patent and all its related data
   * @param id The patent ID
   * @returns A boolean indicating success
   */
  async deletePatent(id: string): Promise<boolean> {
    try {
      console.log(`🔄 DELETING PATENT FROM SUPABASE (ID: ${id})`);
      
      // Delete the patent (cascade will handle related records)
      const { error } = await supabase
        .from('patents')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('❌ ERROR DELETING PATENT:', error);
        throw error;
      }
      
      console.log(`✅ PATENT DELETED SUCCESSFULLY (ID: ${id})`);
      return true;
    } catch (error) {
      console.error('❌ ERROR IN DELETE PATENT FUNCTION:', error);
      throw error;
    }
  }
}; 