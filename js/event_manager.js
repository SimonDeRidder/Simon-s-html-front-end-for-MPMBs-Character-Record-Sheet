const EventType = createEnum([
	'AC_Armor_Bonus_change',
	'AC_Armor_Description_change',
	'AC_Dexterity_Modifier_change',
	'AC_Magic_change',
	'AC_Misc_Mod_1_change',
	'AC_Misc_Mod_2_change',
	'AC_Shield_Bonus_change',
	'AC_Shield_Bonus_Description_change',
	'Acr_Bonus_change',
	'Acr_Exp_change',
	'Acr_Prof_change',
	'Adventuring_Gear_Amount_1_change',
	'Adventuring_Gear_Amount_2_change',
	'Adventuring_Gear_Amount_3_change',
	'Adventuring_Gear_Amount_4_change',
	'Adventuring_Gear_Amount_5_change',
	'Adventuring_Gear_Amount_6_change',
	'Adventuring_Gear_Amount_7_change',
	'Adventuring_Gear_Amount_8_change',
	'Adventuring_Gear_Amount_9_change',
	'Adventuring_Gear_Amount_10_change',
	'Adventuring_Gear_Amount_11_change',
	'Adventuring_Gear_Amount_12_change',
	'Adventuring_Gear_Amount_13_change',
	'Adventuring_Gear_Amount_14_change',
	'Adventuring_Gear_Amount_15_change',
	'Adventuring_Gear_Amount_16_change',
	'Adventuring_Gear_Amount_17_change',
	'Adventuring_Gear_Amount_18_change',
	'Adventuring_Gear_Amount_19_change',
	'Adventuring_Gear_Amount_20_change',
	'Adventuring_Gear_Amount_21_change',
	'Adventuring_Gear_Amount_22_change',
	'Adventuring_Gear_Amount_23_change',
	'Adventuring_Gear_Amount_24_change',
	'Adventuring_Gear_Amount_25_change',
	'Adventuring_Gear_Amount_26_change',
	'Adventuring_Gear_Amount_27_change',
	'Adventuring_Gear_Amount_28_change',
	'Adventuring_Gear_Amount_29_change',
	'Adventuring_Gear_Amount_30_change',
	'Adventuring_Gear_Amount_31_change',
	'Adventuring_Gear_Amount_32_change',
	'Adventuring_Gear_Amount_33_change',
	'Adventuring_Gear_Amount_34_change',
	'Adventuring_Gear_Amount_35_change',
	'Adventuring_Gear_Amount_36_change',
	'Adventuring_Gear_Amount_37_change',
	'Adventuring_Gear_Amount_38_change',
	'Adventuring_Gear_Amount_39_change',
	'Adventuring_Gear_Amount_40_change',
	'Adventuring_Gear_Amount_41_change',
	'Adventuring_Gear_Amount_42_change',
	'Adventuring_Gear_Amount_43_change',
	'Adventuring_Gear_Amount_44_change',
	'Adventuring_Gear_Amount_45_change',
	'Adventuring_Gear_Amount_46_change',
	'Adventuring_Gear_Amount_47_change',
	'Adventuring_Gear_Amount_48_change',
	'Adventuring_Gear_Amount_49_change',
	'Adventuring_Gear_Amount_50_change',
	'Adventuring_Gear_Amount_51_change',
	'Adventuring_Gear_Amount_52_change',
	'Adventuring_Gear_Amount_53_change',
	'Adventuring_Gear_Amount_54_change',
	'Adventuring_Gear_Location_SubtotalName_1_change',
	'Adventuring_Gear_Location_SubtotalName_2_change',
	'Adventuring_Gear_Location_SubtotalName_3_change',
	'Adventuring_Gear_Location_SubtotalName_4_change',
	'Adventuring_Gear_Location_SubtotalName_5_change',
	'Adventuring_Gear_Location_SubtotalName_6_change',
	'Adventuring_Gear_Location_SubtotalName_7_change',
	'Adventuring_Gear_Location_SubtotalName_8_change',
	'Adventuring_Gear_Location_SubtotalName_9_change',
	'Adventuring_Gear_Location_Row_1_change',
	'Adventuring_Gear_Location_Row_2_change',
	'Adventuring_Gear_Location_Row_3_change',
	'Adventuring_Gear_Location_Row_4_change',
	'Adventuring_Gear_Location_Row_5_change',
	'Adventuring_Gear_Location_Row_6_change',
	'Adventuring_Gear_Location_Row_7_change',
	'Adventuring_Gear_Location_Row_8_change',
	'Adventuring_Gear_Location_Row_9_change',
	'Adventuring_Gear_Location_Row_10_change',
	'Adventuring_Gear_Location_Row_11_change',
	'Adventuring_Gear_Location_Row_12_change',
	'Adventuring_Gear_Location_Row_13_change',
	'Adventuring_Gear_Location_Row_14_change',
	'Adventuring_Gear_Location_Row_15_change',
	'Adventuring_Gear_Location_Row_16_change',
	'Adventuring_Gear_Location_Row_17_change',
	'Adventuring_Gear_Location_Row_18_change',
	'Adventuring_Gear_Location_Row_19_change',
	'Adventuring_Gear_Location_Row_20_change',
	'Adventuring_Gear_Location_Row_21_change',
	'Adventuring_Gear_Location_Row_22_change',
	'Adventuring_Gear_Location_Row_23_change',
	'Adventuring_Gear_Location_Row_24_change',
	'Adventuring_Gear_Location_Row_25_change',
	'Adventuring_Gear_Location_Row_26_change',
	'Adventuring_Gear_Location_Row_27_change',
	'Adventuring_Gear_Location_Row_28_change',
	'Adventuring_Gear_Location_Row_29_change',
	'Adventuring_Gear_Location_Row_30_change',
	'Adventuring_Gear_Location_Row_31_change',
	'Adventuring_Gear_Location_Row_32_change',
	'Adventuring_Gear_Location_Row_33_change',
	'Adventuring_Gear_Location_Row_34_change',
	'Adventuring_Gear_Location_Row_35_change',
	'Adventuring_Gear_Location_Row_36_change',
	'Adventuring_Gear_Location_Row_37_change',
	'Adventuring_Gear_Location_Row_38_change',
	'Adventuring_Gear_Location_Row_39_change',
	'Adventuring_Gear_Location_Row_40_change',
	'Adventuring_Gear_Location_Row_41_change',
	'Adventuring_Gear_Location_Row_42_change',
	'Adventuring_Gear_Location_Row_43_change',
	'Adventuring_Gear_Location_Row_44_change',
	'Adventuring_Gear_Location_Row_45_change',
	'Adventuring_Gear_Location_Row_46_change',
	'Adventuring_Gear_Location_Row_47_change',
	'Adventuring_Gear_Location_Row_48_change',
	'Adventuring_Gear_Location_Row_49_change',
	'Adventuring_Gear_Location_Row_50_change',
	'Adventuring_Gear_Location_Row_51_change',
	'Adventuring_Gear_Location_Row_52_change',
	'Adventuring_Gear_Location_Row_53_change',
	'Adventuring_Gear_Location_Row_54_change',
	'Adventuring_Gear_Weight_1_change',
	'Adventuring_Gear_Weight_2_change',
	'Adventuring_Gear_Weight_3_change',
	'Adventuring_Gear_Weight_4_change',
	'Adventuring_Gear_Weight_5_change',
	'Adventuring_Gear_Weight_6_change',
	'Adventuring_Gear_Weight_7_change',
	'Adventuring_Gear_Weight_8_change',
	'Adventuring_Gear_Weight_9_change',
	'Adventuring_Gear_Weight_10_change',
	'Adventuring_Gear_Weight_11_change',
	'Adventuring_Gear_Weight_12_change',
	'Adventuring_Gear_Weight_13_change',
	'Adventuring_Gear_Weight_14_change',
	'Adventuring_Gear_Weight_15_change',
	'Adventuring_Gear_Weight_16_change',
	'Adventuring_Gear_Weight_17_change',
	'Adventuring_Gear_Weight_18_change',
	'Adventuring_Gear_Weight_19_change',
	'Adventuring_Gear_Weight_20_change',
	'Adventuring_Gear_Weight_21_change',
	'Adventuring_Gear_Weight_22_change',
	'Adventuring_Gear_Weight_23_change',
	'Adventuring_Gear_Weight_24_change',
	'Adventuring_Gear_Weight_25_change',
	'Adventuring_Gear_Weight_26_change',
	'Adventuring_Gear_Weight_27_change',
	'Adventuring_Gear_Weight_28_change',
	'Adventuring_Gear_Weight_29_change',
	'Adventuring_Gear_Weight_30_change',
	'Adventuring_Gear_Weight_31_change',
	'Adventuring_Gear_Weight_32_change',
	'Adventuring_Gear_Weight_33_change',
	'Adventuring_Gear_Weight_34_change',
	'Adventuring_Gear_Weight_35_change',
	'Adventuring_Gear_Weight_36_change',
	'Adventuring_Gear_Weight_37_change',
	'Adventuring_Gear_Weight_38_change',
	'Adventuring_Gear_Weight_39_change',
	'Adventuring_Gear_Weight_40_change',
	'Adventuring_Gear_Weight_41_change',
	'Adventuring_Gear_Weight_42_change',
	'Adventuring_Gear_Weight_43_change',
	'Adventuring_Gear_Weight_44_change',
	'Adventuring_Gear_Weight_45_change',
	'Adventuring_Gear_Weight_46_change',
	'Adventuring_Gear_Weight_47_change',
	'Adventuring_Gear_Weight_48_change',
	'Adventuring_Gear_Weight_49_change',
	'Adventuring_Gear_Weight_50_change',
	'Adventuring_Gear_Weight_51_change',
	'Adventuring_Gear_Weight_52_change',
	'Adventuring_Gear_Weight_53_change',
	'Adventuring_Gear_Weight_54_change',
	'All_Skills_Bonus_change',
	'All_ST_Bonus_change',
	'Ani_Bonus_change',
	'Ani_Exp_change',
	'Ani_Prof_change',
	'Arc_Bonus_change',
	'Arc_Exp_change',
	'Arc_Prof_change',
	'Ath_Bonus_change',
	'Ath_Exp_change',
	'Ath_Prof_change',
	'Attack_1_Damage_Type_change',
	'Attack_2_Damage_Type_change',
	'Attack_3_Damage_Type_change',
	'Attack_4_Damage_Type_change',
	'Attack_5_Damage_Type_change',
	'Attack_1_Description_change',
	'Attack_2_Description_change',
	'Attack_3_Description_change',
	'Attack_4_Description_change',
	'Attack_5_Description_change',
	'Attack_1_Proficiency_change',
	'Attack_2_Proficiency_change',
	'Attack_3_Proficiency_change',
	'Attack_4_Proficiency_change',
	'Attack_5_Proficiency_change',
	'Attack_1_Mod_change',
	'Attack_2_Mod_change',
	'Attack_3_Mod_change',
	'Attack_4_Mod_change',
	'Attack_5_Mod_change',
	'Attack_1_Range_change',
	'Attack_2_Range_change',
	'Attack_3_Range_change',
	'Attack_4_Range_change',
	'Attack_5_Range_change',
	'BlueText_Attack_1_Damage_Bonus_change',
	'BlueText_Attack_2_Damage_Bonus_change',
	'BlueText_Attack_3_Damage_Bonus_change',
	'BlueText_Attack_4_Damage_Bonus_change',
	'BlueText_Attack_5_Damage_Bonus_change',
	'BlueText_Attack_1_Damage_Die_change',
	'BlueText_Attack_2_Damage_Die_change',
	'BlueText_Attack_3_Damage_Die_change',
	'BlueText_Attack_4_Damage_Die_change',
	'BlueText_Attack_5_Damage_Die_change',
	'BlueText_Attack_1_To_Hit_Bonus_change',
	'BlueText_Attack_2_To_Hit_Bonus_change',
	'BlueText_Attack_3_To_Hit_Bonus_change',
	'BlueText_Attack_4_To_Hit_Bonus_change',
	'BlueText_Attack_5_To_Hit_Bonus_change',
	'BlueText_Comp_Use_Ability_All_ST_Bonus_change',
	'BlueText_Comp_Use_Ability_Cha_ST_Bonus_change',
	'BlueText_Comp_Use_Ability_Con_ST_Bonus_change',
	'BlueText_Comp_Use_Ability_Dex_ST_Bonus_change',
	'BlueText_Comp_Use_Ability_Int_ST_Bonus_change',
	'BlueText_Comp_Use_Ability_Str_ST_Bonus_change',
	'BlueText_Comp_Use_Ability_Wis_ST_Bonus_change',
	'BlueText_Comp_Use_Attack_1_Damage_Bonus_change',
	'BlueText_Comp_Use_Attack_1_Damage_Die_change',
	'BlueText_Comp_Use_Attack_1_To_Hit_Bonus_change',
	'BlueText_Comp_Use_Attack_2_Damage_Bonus_change',
	'BlueText_Comp_Use_Attack_2_Damage_Die_change',
	'BlueText_Comp_Use_Attack_2_To_Hit_Bonus_change',
	'BlueText_Comp_Use_Attack_3_Damage_Bonus_change',
	'BlueText_Comp_Use_Attack_3_Damage_Die_change',
	'BlueText_Comp_Use_Attack_3_To_Hit_Bonus_change',
	'BlueText_Comp_Use_Proficiency_Bonus_Dice_change',
	'BlueText_Comp_Use_Skills_All_Bonus_change',
	'BlueText_Comp_Use_Skills_Acr_Bonus_change',
	'BlueText_Comp_Use_Skills_Ani_Bonus_change',
	'BlueText_Comp_Use_Skills_Arc_Bonus_change',
	'BlueText_Comp_Use_Skills_Ath_Bonus_change',
	'BlueText_Comp_Use_Skills_Dec_Bonus_change',
	'BlueText_Comp_Use_Skills_His_Bonus_change',
	'BlueText_Comp_Use_Skills_Ins_Bonus_change',
	'BlueText_Comp_Use_Skills_Inti_Bonus_change',
	'BlueText_Comp_Use_Skills_Inv_Bonus_change',
	'BlueText_Comp_Use_Skills_Med_Bonus_change',
	'BlueText_Comp_Use_Skills_Nat_Bonus_change',
	'BlueText_Comp_Use_Skills_Perc_Bonus_change',
	'BlueText_Comp_Use_Skills_Perc_Pass_Bonus_change',
	'BlueText_Comp_Use_Skills_Perf_Bonus_change',
	'BlueText_Comp_Use_Skills_Pers_Bonus_change',
	'BlueText_Comp_Use_Skills_Rel_Bonus_change',
	'BlueText_Comp_Use_Skills_Sle_Bonus_change',
	'BlueText_Comp_Use_Skills_Ste_Bonus_change',
	'BlueText_Comp_Use_Skills_Sur_Bonus_change',
	'BlueText_Players_Make_All_Rolls_change',
	'Cha_change',
	'Cha_Mod_change',
	'Cha_ST_Bonus_change',
	'Cha_ST_Mod_change',
	'Cha_ST_Prof_change',
	'Character_Level_change',
	'Cnote_Left_change',
	'Comp_eqp_Gear_Amount_1_change',
	'Comp_eqp_Gear_Amount_2_change',
	'Comp_eqp_Gear_Amount_3_change',
	'Comp_eqp_Gear_Amount_4_change',
	'Comp_eqp_Gear_Amount_5_change',
	'Comp_eqp_Gear_Amount_6_change',
	'Comp_eqp_Gear_Amount_7_change',
	'Comp_eqp_Gear_Amount_8_change',
	'Comp_eqp_Gear_Amount_9_change',
	'Comp_eqp_Gear_Amount_10_change',
	'Comp_eqp_Gear_Amount_11_change',
	'Comp_eqp_Gear_Amount_12_change',
	'Comp_eqp_Gear_Amount_13_change',
	'Comp_eqp_Gear_Amount_14_change',
	'Comp_eqp_Gear_Amount_15_change',
	'Comp_eqp_Gear_Amount_16_change',
	'Comp_eqp_Gear_Amount_17_change',
	'Comp_eqp_Gear_Weight_1_change',
	'Comp_eqp_Gear_Weight_2_change',
	'Comp_eqp_Gear_Weight_3_change',
	'Comp_eqp_Gear_Weight_4_change',
	'Comp_eqp_Gear_Weight_5_change',
	'Comp_eqp_Gear_Weight_6_change',
	'Comp_eqp_Gear_Weight_7_change',
	'Comp_eqp_Gear_Weight_8_change',
	'Comp_eqp_Gear_Weight_9_change',
	'Comp_eqp_Gear_Weight_10_change',
	'Comp_eqp_Gear_Weight_11_change',
	'Comp_eqp_Gear_Weight_12_change',
	'Comp_eqp_Gear_Weight_13_change',
	'Comp_eqp_Gear_Weight_14_change',
	'Comp_eqp_Gear_Weight_15_change',
	'Comp_eqp_Gear_Weight_16_change',
	'Comp_eqp_Gear_Weight_17_change',
	'Comp_Use_Ability_Cha_Mod_change',
	'Comp_Use_Ability_Cha_Score_change',
	'Comp_Use_Ability_Cha_ST_Prof_change',
	'Comp_Use_Ability_Con_Mod_change',
	'Comp_Use_Ability_Con_Score_change',
	'Comp_Use_Ability_Con_ST_Prof_change',
	'Comp_Use_Ability_Dex_Mod_change',
	'Comp_Use_Ability_Dex_Score_change',
	'Comp_Use_Ability_Dex_ST_Prof_change',
	'Comp_Use_Ability_HoS_Mod_change',
	'Comp_Use_Ability_HoS_Score_change',
	'Comp_Use_Ability_HoS_ST_Prof_change',
	'Comp_Use_Ability_Int_Mod_change',
	'Comp_Use_Ability_Int_Score_change',
	'Comp_Use_Ability_Int_ST_Prof_change',
	'Comp_Use_Ability_Str_Mod_change',
	'Comp_Use_Ability_Str_Score_change',
	'Comp_Use_Ability_Str_ST_Prof_change',
	'Comp_Use_Ability_Wis_Mod_change',
	'Comp_Use_Ability_Wis_Score_change',
	'Comp_Use_Ability_Wis_ST_Prof_change',
	'Comp_Use_Attack_1_Damage_Type_change',
	'Comp_Use_Attack_1_Description_change',
	'Comp_Use_Attack_1_Mod_change',
	'Comp_Use_Attack_1_Proficiency_change',
	'Comp_Use_Attack_1_Range_change',
	'Comp_Use_Attack_2_Damage_Type_change',
	'Comp_Use_Attack_2_Description_change',
	'Comp_Use_Attack_2_Mod_change',
	'Comp_Use_Attack_2_Proficiency_change',
	'Comp_Use_Attack_2_Range_change',
	'Comp_Use_Attack_3_Damage_Type_change',
	'Comp_Use_Attack_3_Description_change',
	'Comp_Use_Attack_3_Mod_change',
	'Comp_Use_Attack_3_Proficiency_change',
	'Comp_Use_Attack_3_Range_change',
	'Comp_Use_Combat_Init_Bonus_change',
	'Comp_Use_HD_Die_change',
	'Comp_Use_HD_Level_change',
	'Comp_Use_Proficiency_Bonus_change',
	'Comp_Use_Skills_Acr_Exp_change',
	'Comp_Use_Skills_Acr_Prof_change',
	'Comp_Use_Skills_Ani_Exp_change',
	'Comp_Use_Skills_Ani_Prof_change',
	'Comp_Use_Skills_Arc_Exp_change',
	'Comp_Use_Skills_Arc_Prof_change',
	'Comp_Use_Skills_Ath_Exp_change',
	'Comp_Use_Skills_Ath_Prof_change',
	'Comp_Use_Skills_Dec_Exp_change',
	'Comp_Use_Skills_Dec_Prof_change',
	'Comp_Use_Skills_His_Exp_change',
	'Comp_Use_Skills_His_Prof_change',
	'Comp_Use_Skills_Ins_Exp_change',
	'Comp_Use_Skills_Ins_Prof_change',
	'Comp_Use_Skills_Inti_Exp_change',
	'Comp_Use_Skills_Inti_Prof_change',
	'Comp_Use_Skills_Inv_Exp_change',
	'Comp_Use_Skills_Inv_Prof_change',
	'Comp_Use_Skills_Med_Exp_change',
	'Comp_Use_Skills_Med_Prof_change',
	'Comp_Use_Skills_Nat_Exp_change',
	'Comp_Use_Skills_Nat_Prof_change',
	'Comp_Use_Skills_Perc_Exp_change',
	'Comp_Use_Skills_Perc_Prof_change',
	'Comp_Use_Skills_Perf_Exp_change',
	'Comp_Use_Skills_Perf_Prof_change',
	'Comp_Use_Skills_Pers_Exp_change',
	'Comp_Use_Skills_Pers_Prof_change',
	'Comp_Use_Skills_Rel_Exp_change',
	'Comp_Use_Skills_Rel_Prof_change',
	'Comp_Use_Skills_Sle_Exp_change',
	'Comp_Use_Skills_Sle_Prof_change',
	'Comp_Use_Skills_Ste_Exp_change',
	'Comp_Use_Skills_Ste_Prof_change',
	'Comp_Use_Skills_Sur_Exp_change',
	'Comp_Use_Skills_Sur_Prof_change',
	'Con_change',
	'Con_Mod_change',
	'Con_ST_Bonus_change',
	'Con_ST_Mod_change',
	'Con_ST_Prof_change',
	'Dec_Bonus_change',
	'Dec_Exp_change',
	'Dec_Prof_change',
	'Dex_change',
	'Dex_Mod_change',
	'Dex_ST_Bonus_change',
	'Dex_ST_Mod_change',
	'Dex_ST_Prof_change',
	'Extra_Condition_8_change',
	'Extra_Condition_9_change',
	'Extra_Condition_13_change',
	'Extra_Condition_14_change',
	'Extra_Gear_Amount_1_change',
	'Extra_Gear_Amount_2_change',
	'Extra_Gear_Amount_3_change',
	'Extra_Gear_Amount_4_change',
	'Extra_Gear_Amount_5_change',
	'Extra_Gear_Amount_6_change',
	'Extra_Gear_Amount_7_change',
	'Extra_Gear_Amount_8_change',
	'Extra_Gear_Amount_9_change',
	'Extra_Gear_Amount_10_change',
	'Extra_Gear_Amount_11_change',
	'Extra_Gear_Amount_12_change',
	'Extra_Gear_Amount_13_change',
	'Extra_Gear_Amount_14_change',
	'Extra_Gear_Amount_15_change',
	'Extra_Gear_Amount_16_change',
	'Extra_Gear_Amount_17_change',
	'Extra_Gear_Amount_18_change',
	'Extra_Gear_Amount_19_change',
	'Extra_Gear_Amount_20_change',
	'Extra_Gear_Amount_21_change',
	'Extra_Gear_Amount_22_change',
	'Extra_Gear_Amount_23_change',
	'Extra_Gear_Amount_24_change',
	'Extra_Gear_Amount_25_change',
	'Extra_Gear_Amount_26_change',
	'Extra_Gear_Amount_27_change',
	'Extra_Gear_Amount_28_change',
	'Extra_Gear_Amount_29_change',
	'Extra_Gear_Amount_30_change',
	'Extra_Gear_Amount_31_change',
	'Extra_Gear_Amount_32_change',
	'Extra_Gear_Amount_33_change',
	'Extra_Gear_Amount_34_change',
	'Extra_Gear_Amount_35_change',
	'Extra_Gear_Amount_36_change',
	'Extra_Gear_Location_Row_1_change',
	'Extra_Gear_Location_Row_2_change',
	'Extra_Gear_Location_Row_3_change',
	'Extra_Gear_Location_Row_4_change',
	'Extra_Gear_Location_Row_5_change',
	'Extra_Gear_Location_Row_6_change',
	'Extra_Gear_Location_Row_7_change',
	'Extra_Gear_Location_Row_8_change',
	'Extra_Gear_Location_Row_9_change',
	'Extra_Gear_Location_Row_10_change',
	'Extra_Gear_Location_Row_11_change',
	'Extra_Gear_Location_Row_12_change',
	'Extra_Gear_Location_Row_13_change',
	'Extra_Gear_Location_Row_14_change',
	'Extra_Gear_Location_Row_15_change',
	'Extra_Gear_Location_Row_16_change',
	'Extra_Gear_Location_Row_17_change',
	'Extra_Gear_Location_Row_18_change',
	'Extra_Gear_Location_Row_19_change',
	'Extra_Gear_Location_Row_20_change',
	'Extra_Gear_Location_Row_21_change',
	'Extra_Gear_Location_Row_22_change',
	'Extra_Gear_Location_Row_23_change',
	'Extra_Gear_Location_Row_24_change',
	'Extra_Gear_Location_Row_25_change',
	'Extra_Gear_Location_Row_26_change',
	'Extra_Gear_Location_Row_27_change',
	'Extra_Gear_Location_Row_28_change',
	'Extra_Gear_Location_Row_29_change',
	'Extra_Gear_Location_Row_30_change',
	'Extra_Gear_Location_Row_31_change',
	'Extra_Gear_Location_Row_32_change',
	'Extra_Gear_Location_Row_33_change',
	'Extra_Gear_Location_Row_34_change',
	'Extra_Gear_Location_Row_35_change',
	'Extra_Gear_Location_Row_36_change',
	'Extra_Gear_Weight_1_change',
	'Extra_Gear_Weight_2_change',
	'Extra_Gear_Weight_3_change',
	'Extra_Gear_Weight_4_change',
	'Extra_Gear_Weight_5_change',
	'Extra_Gear_Weight_6_change',
	'Extra_Gear_Weight_7_change',
	'Extra_Gear_Weight_8_change',
	'Extra_Gear_Weight_9_change',
	'Extra_Gear_Weight_10_change',
	'Extra_Gear_Weight_11_change',
	'Extra_Gear_Weight_12_change',
	'Extra_Gear_Weight_13_change',
	'Extra_Gear_Weight_14_change',
	'Extra_Gear_Weight_15_change',
	'Extra_Gear_Weight_16_change',
	'Extra_Gear_Weight_17_change',
	'Extra_Gear_Weight_18_change',
	'Extra_Gear_Weight_19_change',
	'Extra_Gear_Weight_20_change',
	'Extra_Gear_Weight_21_change',
	'Extra_Gear_Weight_22_change',
	'Extra_Gear_Weight_23_change',
	'Extra_Gear_Weight_24_change',
	'Extra_Gear_Weight_25_change',
	'Extra_Gear_Weight_26_change',
	'Extra_Gear_Weight_27_change',
	'Extra_Gear_Weight_28_change',
	'Extra_Gear_Weight_29_change',
	'Extra_Gear_Weight_30_change',
	'Extra_Gear_Weight_31_change',
	'Extra_Gear_Weight_32_change',
	'Extra_Gear_Weight_33_change',
	'Extra_Gear_Weight_34_change',
	'Extra_Gear_Weight_35_change',
	'Extra_Gear_Weight_36_change',
	'HD1_Die_change',
	'HD2_Die_change',
	'HD3_Die_change',
	'HD1_Level_change',
	'HD2_Level_change',
	'HD3_Level_change',
	'Heavy_Armor_change',
	'His_Bonus_change',
	'His_Exp_change',
	'His_Prof_change',
	'HoS_change',
	'HoS_Mod_change',
	'HoS_ST_Mod_change',
	'HoS_ST_Prof_change',
	'Init_Bonus_change',
	'Ins_Bonus_change',
	'Ins_Exp_change',
	'Ins_Prof_change',
	'Int_change',
	'Int_Mod_change',
	'Int_ST_Bonus_change',
	'Int_ST_Mod_change',
	'Int_ST_Prof_change',
	'Inti_Bonus_change',
	'Inti_Exp_change',
	'Inti_Prof_change',
	'Inv_Bonus_change',
	'Inv_Exp_change',
	'Inv_Prof_change',
	'Jack_of_All_Trades_change',
	'Limited_Feature_Used_1_change',
	'Limited_Feature_Used_2_change',
	'Limited_Feature_Used_3_change',
	'Limited_Feature_Used_4_change',
	'Limited_Feature_Used_5_change',
	'Limited_Feature_Used_6_change',
	'Limited_Feature_Used_7_change',
	'Limited_Feature_Used_8_change',
	'Limited_Feature_Used_9_change',
	'Limited_Feature_Used_10_change',
	'Limited_Feature_Used_11_change',
	'Limited_Feature_Used_12_change',
	'Limited_Feature_Used_13_change',
	'Limited_Feature_Used_14_change',
	'Limited_Feature_Used_15_change',
	'Limited_Feature_Used_16_change',
	'Med_Bonus_change',
	'Med_Exp_change',
	'Med_Prof_change',
	'Medium_Armor_change',
	'Medium_Armor_Max_Mod_change',
	'Nat_Bonus_change',
	'Nat_Exp_change',
	'Nat_Prof_change',
	'Passive_Perception_change',
	'Passive_Perception_Bonus_change',
	'Perc_Bonus_change',
	'Perc_Exp_change',
	'Perc_Prof_change',
	'Perf_Bonus_change',
	'Perf_Exp_change',
	'Perf_Prof_change',
	'Pers_Bonus_change',
	'Pers_Exp_change',
	'Pers_Prof_change',
	'Proficiency_Armor_Heavy_change',
	'Proficiency_Armor_Light_change',
	'Proficiency_Armor_Medium_change',
	'Proficiency_Bonus_change',
	'Proficiency_Bonus_Dice_change',
	'Proficiency_Shields_change',
	'Rel_Bonus_change',
	'Rel_Exp_change',
	'Rel_Prof_change',
	'Remarkable_Athlete_change',
	'Sle_Bonus_change',
	'Sle_Exp_change',
	'Sle_Prof_change',
	'Ste_Bonus_change',
	'Ste_Exp_change',
	'Ste_Prof_change',
	'Str_Mod_change',
	'Str_ST_Mod_change',
	'Sur_Bonus_change',
	'Sur_Exp_change',
	'Sur_Prof_change',
	'Text_SkillsNames_change',
	'Too_Bonus_change',
	'Too_Exp_change',
	'Too_Prof_change',
	'Unit_System_change',
	'Wis_Mod_change',
	'Wis_ST_Mod_change',
]);


const eventManager = {
	_listeners: new Map(), /*EventType -> Array[function]*/

	add_listener: function(event_type /*EventType*/, func /*function*/) {
		if (this._listeners.has(event_type)) {
			this._listeners.get(event_type).push(func);
		}
		else {
			this._listeners.set(event_type, [func]);
		}
	},

	handle_event: function(event_type /*EventType*/) {
		if (app.calculate) {
			console.log("Event triggered:", event_type);
			if (this._listeners.has(event_type)) {
				this._listeners.get(event_type).forEach(element => {
					element();
				});
			}
		}
	}
};