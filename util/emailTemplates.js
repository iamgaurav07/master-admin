var templates = [{
    testId: "29d1b912-f283-43cf-b268-9a803702e3e1",
    prodId: "29d1b912-f283-43cf-b268-9a803702e3e1",
    name: "Contact-us-to-admin"
  },
  {
    testId: "01d51c51-70b6-40fc-bee2-19418dafc22f",
    prodId: "01d51c51-70b6-40fc-bee2-19418dafc22f",
    name: "Contact-us-to-endUser"
  },
  {
    testId: "cf4cd071-7c7a-499b-bfd9-9256cc64ea69",
    prodId: "cf4cd071-7c7a-499b-bfd9-9256cc64ea69",
    name: "Job_apply_to_admin"
  },
  {
    testId: "58dbbe1e-fcfb-45f7-a3ae-ae0d85684401",
    prodId: "58dbbe1e-fcfb-45f7-a3ae-ae0d85684401",
    name: "Job_apply_to_end_user"
  },
  {
    testId: "de5a18f6-e14e-48fa-af91-28e2860f4a76",
    prodId: "de5a18f6-e14e-48fa-af91-28e2860f4a76",
    name: "Become_master_to_admin"
  },
  {
    testId: "c69501d1-02b4-40fc-aeef-fbb036f87d29",
    prodId: "c69501d1-02b4-40fc-aeef-fbb036f87d29",
    name: "Become_master_to_end_user"
  },
  {
    testId: "97142cd1-5b0b-4d90-8eab-5ab3b27185d9",
    prodId: "97142cd1-5b0b-4d90-8eab-5ab3b27185d9",
    name: "Event_registration_confirmation_to_attendee"
  },
  {
    testId: "c6d13a1a-7bc4-4d64-b0c2-b839ad3110e3",
    prodId: "c6d13a1a-7bc4-4d64-b0c2-b839ad3110e3",
    name: "New_event_registration_to_admin"
  },
  {
    testId: "281fd5d6-00de-49e4-8995-02b365d764f3",
    prodId: "281fd5d6-00de-49e4-8995-02b365d764f3",
    name: "Enroll_club_to_end_User"

  },
  {
    testId: "e61c5e40-22cc-44c3-9589-0faec74be1b9",
    prodId: "e61c5e40-22cc-44c3-9589-0faec74be1b9",
    name: "Enrol_club_to_admin"

  }
];
module.exports = {
  getTemplateIdFromName(templateName, env) {
    let returnValue;

    templates.forEach(element => {
      if (element.name == templateName) {
        if (env == "dev") returnValue = element.testId;
        else returnValue = element.prodId;
      }
    });

    return returnValue;
  }
};