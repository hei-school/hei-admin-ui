import {usersApi} from "@/providers/api";
import {MULTIPART_HEADERS} from "@/providers/constants";
import profilePicProvider from "@/providers/profilePicProvider";
import {UsersApi, WhoamiRoleEnum} from "@haapi/typescript-client";

describe("Profile Pic Provider", () => {
  const mockUserId = "user-123";
  const mockFile = new File(["test"], "profile.jpg", {type: "image/jpeg"});
  const mockResponse = {data: {url: "https://example.com/profile.jpg"}};

  beforeEach(() => {
    cy.stub(usersApi(), "uploadStudentProfilePicture").resolves(mockResponse);
    cy.stub(usersApi(), "uploadTeacherProfilePicture").resolves(mockResponse);
    cy.stub(usersApi(), "uploadManagerProfilePicture").resolves(mockResponse);
    cy.stub(usersApi(), "uploadAdminProfilePicture").resolves(mockResponse);
    cy.stub(usersApi(), "uploadStaffMemberProfilePicture").resolves(
      mockResponse
    );
    cy.stub(usersApi(), "uploadOrganizerProfilePicture").resolves(mockResponse);
  });

  describe("saveOrUpdate()", () => {
    const testCases = [
      {role: WhoamiRoleEnum.STUDENT, method: "uploadStudentProfilePicture"},
      {role: WhoamiRoleEnum.TEACHER, method: "uploadTeacherProfilePicture"},
      {role: WhoamiRoleEnum.MANAGER, method: "uploadManagerProfilePicture"},
      {role: WhoamiRoleEnum.ADMIN, method: "uploadAdminProfilePicture"},
      {
        role: WhoamiRoleEnum.STAFF_MEMBER,
        method: "uploadStaffMemberProfilePicture",
      },
      {role: WhoamiRoleEnum.ORGANIZER, method: "uploadOrganizerProfilePicture"},
    ];

    testCases.forEach(({role, method}) => {
      context(`when user is ${role}`, () => {
        it(`should call ${method}`, () => {
          const payload = [
            {
              id: mockUserId,
              role,
              rawFile: mockFile,
            },
          ];
          profilePicProvider.saveOrUpdate(payload).then((result) => {
            expect(
              usersApi()[method as keyof UsersApi]
            ).to.have.been.calledWith(mockUserId, mockFile, {
              headers: MULTIPART_HEADERS,
            });
            expect(result).to.deep.equal([mockResponse.data]);
          });
        });
      });
    });

    context("with invalid payload", () => {
      it("should throw error when payload is empty", () => {
        profilePicProvider.saveOrUpdate([]).catch((error) => {
          expect(error.message).to.include("Cannot read properties");
        });
      });

      it("should throw error when role is missing", () => {
        const payload = [
          {
            id: mockUserId,
            rawFile: mockFile,
          },
        ];
        profilePicProvider.saveOrUpdate(payload).catch((error) => {
          expect(error).to.exist;
        });
      });
    });
  });

  describe("unimplemented methods", () => {
    it("getList() should throw not implemented error", () => {
      expect(() => profilePicProvider.getList(1, 10, {})).to.throw(
        "Not implemented"
      );
    });

    it("getOne() should throw not implemented error", () => {
      expect(() => profilePicProvider.getOne("")).to.throw("Not implemented");
    });

    it.skip("delete() should throw not implemented error", () => {
      expect(() => profilePicProvider.delete("")).to.throw("Not implemented");
    });
  });
});
