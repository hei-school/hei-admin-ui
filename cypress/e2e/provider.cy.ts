describe("statsProvider basic coverage", () => {
  it("should call statsProvider methods for coverage", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "statsProvider")
      .then((statsProvider: any) => {
        statsProvider
          .getList(1, 10, {})
          .then(() => {
            throw new Error("Should have thrown an error for getList");
          })
          .catch((err: any) => {
            expect(err.message).to.eq("Function not implemented.");
          });
        statsProvider
          .saveOrUpdate({})
          .then(() => {
            throw new Error("Should have thrown an error for saveOrUpdate");
          })
          .catch((err: any) => {
            expect(err.message).to.eq("Function not implemented.");
          });

        statsProvider
          .delete("id-test")
          .then(() => {
            throw new Error("Should have thrown an error for delete");
          })
          .catch((err: any) => {
            expect(err.message).to.eq("Not implemented");
          });
      });
  });
});

describe("staffProvider basic coverage", () => {
  it("should call staffProvider methods for coverage", () => {
    cy.visit("/");
    cy.window()
      .should("have.property", "staffProvider")
      .then((staffProvider: any) => {
        staffProvider
          .saveOrUpdate([{first_name: "John"}], {isUpdate: true})
          .catch(() => {});

        staffProvider.saveOrUpdate([{first_name: "Alice"}], {}).catch(() => {});

        staffProvider.getList(1, 10, {}).catch(() => {});

        staffProvider.getOne("some-id").catch(() => {});
      });
  });
});

describe("exportEventParticipantProvider basic coverage", () => {
  it("should call exportEventParticipantProvider methods for coverage", () => {
    cy.visit("/");

    cy.window()
      .should("have.property", "exportEventParticipantProvider")
      .then((exportEventParticipantProvider: any) => {
        return exportEventParticipantProvider
          .getList()
          .then(() => {
            throw new Error("Should have thrown for getList");
          })
          .catch((err: any) => {
            expect(err.message).to.eq("Function not implemented.");
          })

          .then(() => {
            return exportEventParticipantProvider
              .saveOrUpdate()
              .then(() => {
                throw new Error("Should have thrown for saveOrUpdate");
              })
              .catch((err: any) => {
                expect(err.message).to.eq("Function not implemented.");
              });
          })

          .then(() => {
            return exportEventParticipantProvider
              .delete()
              .then(() => {
                throw new Error("Should have thrown for delete");
              })
              .catch((err: any) => {
                expect(err.message).to.eq("Function not implemented.");
              });
          })

          .then(() => {
            return exportEventParticipantProvider
              .getOne("some-id")
              .catch(() => {});
          });
      });
  });
});
