package org.andreiz0r.ums.util;

import static org.junit.jupiter.api.Assertions.fail;

public abstract class BaseUnitTest {
    public void assertThatFails() {
        fail("Should have valid user data");
    }

    public void assertThatFails(final Object object) {
        fail("Should not contain: " + object);
    }
}
