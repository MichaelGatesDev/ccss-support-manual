import { RoomFactory, RoomType } from "@ccss-support-manual/models";
import { RoomUtils } from "@ccss-support-manual/utilities";

test("creates a room", (): void => {

    const room = new RoomFactory()
        .withBuildingName("Test Building")
        .withNumber("100")
        .withType(RoomType.Room)
        .build();

    expect(RoomUtils.isRoom(room));


});