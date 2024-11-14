package org.andreiz0r.ums.service;

import org.andreiz0r.core.dto.UpdateDeviceIdsDTO;
import org.andreiz0r.core.dto.UserDTO;
import org.andreiz0r.core.event.UpdateDeviceIdsEvent;
import org.andreiz0r.ums.entity.User;
import org.andreiz0r.ums.producer.RabbitProducer;
import org.andreiz0r.ums.repository.UserRepository;
import org.andreiz0r.ums.util.BaseUnitTest;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

import static org.andreiz0r.core.util.Randoms.alphabetic;
import static org.andreiz0r.ums.util.TestUtils.RequestUtils.createUserRequest;
import static org.andreiz0r.ums.util.TestUtils.RequestUtils.updateUserRequest;
import static org.andreiz0r.ums.util.TestUtils.UserUtils.convertToDTO;
import static org.andreiz0r.ums.util.TestUtils.UserUtils.randomUser;
import static org.hamcrest.MatcherAssert.assertThat;
import static org.hamcrest.Matchers.equalTo;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.mockStatic;
import static org.mockito.Mockito.never;
import static org.mockito.Mockito.times;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;
import static org.mockito.MockitoAnnotations.openMocks;

class UserServiceTest extends BaseUnitTest {

    @Mock
    private UserRepository repository;

    @Mock
    private PasswordEncoder passwordEncoder;

    @Mock
    private RabbitProducer rabbitProducer;

    @InjectMocks
    private UserService victim;

    @BeforeEach
    void setUp() {
        openMocks(this);
    }

    @Test
    void getUsers_retrievesDataFromRepository_success() {
        List<User> expectedUsers = List.of(randomUser(), randomUser());
        when(repository.findAll()).thenReturn(expectedUsers);

        Optional<List<UserDTO>> response = victim.getUsers();

        verify(repository).findAll();
        response.ifPresentOrElse(
                users -> assertThat(users, equalTo(convertToDTO(expectedUsers))),
                this::assertThatFails
        );
    }

    @Test
    void getUsers_empty_success() {
        when(repository.findAll()).thenReturn(List.of());

        Optional<List<UserDTO>> response = victim.getUsers();

        verify(repository).findAll();
        response.ifPresentOrElse(
                users -> assertThat(users, equalTo(List.of())),
                this::assertThatFails
        );
    }

    @Test
    void findById_findsUser_success() {
        User expectedUser = randomUser();
        when(repository.findById(expectedUser.getId())).thenReturn(Optional.of(expectedUser));

        Optional<UserDTO> response = victim.findById(expectedUser.getId());

        verify(repository).findById(expectedUser.getId());
        response.ifPresentOrElse(
                user -> assertThat(user, equalTo(convertToDTO(expectedUser))),
                this::assertThatFails
        );
    }

    @Test
    void findById_userNotFound_returnsEmptyOptional() {
        when(repository.findById(any())).thenReturn(Optional.empty());

        Optional<UserDTO> response = victim.findById(UUID.randomUUID());

        verify(repository).findById(any());
        response.ifPresent(this::assertThatFails);
    }

    @Test
    void findByUsername_findsUser_success() {
        User expectedUser = randomUser();
        when(repository.findByUsername(expectedUser.getUsername())).thenReturn(Optional.of(expectedUser));

        Optional<UserDTO> response = victim.findByUsername(expectedUser.getUsername());

        verify(repository).findByUsername(expectedUser.getUsername());
        response.ifPresentOrElse(
                user -> assertThat(user, equalTo(convertToDTO(expectedUser))),
                this::assertThatFails
        );
    }

    @Test
    void findByUsername_userNotFound_returnsEmptyOptional() {
        when(repository.findByUsername(anyString())).thenReturn(Optional.empty());

        Optional<UserDTO> response = victim.findByUsername(alphabetic());

        verify(repository).findByUsername(anyString());
        response.ifPresent(this::assertThatFails);
    }

    @Test
    void create_userIsCreated_success() {
        User expectedUser = prepareUserBuilder();

        Optional<UserDTO> response = victim.create(createUserRequest(expectedUser));

        ArgumentCaptor<UpdateDeviceIdsEvent> eventCaptor = ArgumentCaptor.forClass(UpdateDeviceIdsEvent.class);
        verify(repository).save(expectedUser);
        verify(passwordEncoder).encode(expectedUser.getPassword());
        verify(rabbitProducer).produce(eventCaptor.capture());
        assertThat(
                eventCaptor.getValue().getEventData(),
                equalTo(new UpdateDeviceIdsDTO(expectedUser.getId(), expectedUser.getDeviceIds())));
        response.ifPresentOrElse(
                user -> assertThat(user, equalTo(convertToDTO(expectedUser))),
                this::assertThatFails
        );
    }

    @Test
    void update_userIsFound_successfullyUpdates() {
        User initialUser = randomUser();
        List<UUID> initialDevices = initialUser.getDeviceIds();
        User updatedUser = randomUser();
        updatedUser.setId(initialUser.getId());
        updatedUser.setCreatedAt(initialUser.getCreatedAt());
        when(repository.findById(initialUser.getId())).thenReturn(Optional.of(initialUser));

        Optional<UserDTO> response = victim.update(updateUserRequest(updatedUser));

        ArgumentCaptor<UpdateDeviceIdsEvent> eventCaptor = ArgumentCaptor.forClass(UpdateDeviceIdsEvent.class);
        verify(repository).findById(initialUser.getId());
        verify(repository).save(initialUser);
        verify(rabbitProducer, times(2)).produce(eventCaptor.capture());
        response.ifPresentOrElse(
                user -> {
                    List<UpdateDeviceIdsEvent> events = eventCaptor.getAllValues();

                    assertThat(user, equalTo(convertToDTO(updatedUser)));
                    assertThat(events.get(0).getEventData(),
                               equalTo(new UpdateDeviceIdsDTO(null, initialDevices)));
                    assertThat(events.get(1).getEventData(),
                               equalTo(new UpdateDeviceIdsDTO(user.id(), user.deviceIds())));
                },
                this::assertThatFails
        );
    }

    @Test
    void update_userIsFoundWithSameDevices_successfullyUpdates() {
        User initialUser = randomUser();
        User updatedUser = randomUser();
        updatedUser.setId(initialUser.getId());
        updatedUser.setCreatedAt(initialUser.getCreatedAt());
        updatedUser.setDeviceIds(initialUser.getDeviceIds());
        when(repository.findById(initialUser.getId())).thenReturn(Optional.of(initialUser));

        Optional<UserDTO> response = victim.update(updateUserRequest(updatedUser));

        ArgumentCaptor<UpdateDeviceIdsEvent> eventCaptor = ArgumentCaptor.forClass(UpdateDeviceIdsEvent.class);
        verify(repository).findById(initialUser.getId());
        verify(repository).save(initialUser);
        verify(rabbitProducer).produce(eventCaptor.capture());
        response.ifPresentOrElse(
                user -> {
                    assertThat(user, equalTo(convertToDTO(updatedUser)));
                    assertThat(eventCaptor.getValue().getEventData(),
                               equalTo(new UpdateDeviceIdsDTO(user.id(), user.deviceIds())));
                },
                this::assertThatFails
        );
    }

    @Test
    void update_userIsNotFound_returnsEmptyOptional() {
        when(repository.findById(any())).thenReturn(Optional.empty());

        Optional<UserDTO> response = victim.update(updateUserRequest(randomUser()));

        verify(repository).findById(any());
        verify(repository, never()).save(any());
        verify(rabbitProducer, never()).produce(any());
        response.ifPresent(this::assertThatFails);
    }

    @Test
    void deleteById_userIsFound_success() {
        User user = randomUser();
        List<UUID> devices = user.getDeviceIds();
        when(repository.findById(user.getId())).thenReturn(Optional.of(user));
        when(repository.deleteByIdReturning(user.getId())).thenReturn(1);

        Optional<UserDTO> response = victim.deleteById(user.getId());

        ArgumentCaptor<UpdateDeviceIdsEvent> eventCaptor = ArgumentCaptor.forClass(UpdateDeviceIdsEvent.class);
        verify(repository).findById(user.getId());
        verify(repository).deleteByIdReturning(user.getId());
        verify(rabbitProducer).produce(eventCaptor.capture());
        response.ifPresentOrElse(
                deletedUser -> {
                    assertThat(deletedUser, equalTo(convertToDTO(user)));
                    assertThat(eventCaptor.getValue().getEventData(),
                               equalTo(new UpdateDeviceIdsDTO(null, devices)));
                },
                this::assertThatFails
        );
    }

    @Test
    void deleteById_userIsNotFound_returnsEmptyOptional() {
        when(repository.findById(any())).thenReturn(Optional.empty());

        Optional<UserDTO> response = victim.deleteById(UUID.randomUUID());

        verify(repository).findById(any());
        verify(repository, never()).deleteByIdReturning(any());
        verify(rabbitProducer, never()).produce(any());
        response.ifPresent(this::assertThatFails);
    }

    @Test
    void deleteById_userFoundButNotDeleted_doesNotSendEvent() {
        User user = randomUser();
        when(repository.findById(user.getId())).thenReturn(Optional.of(user));
        when(repository.deleteByIdReturning(user.getId())).thenReturn(0);

        Optional<UserDTO> response = victim.deleteById(user.getId());

        verify(repository).findById(user.getId());
        verify(repository).deleteByIdReturning(user.getId());
        verify(rabbitProducer, never()).produce(any());
        response.ifPresent(this::assertThatFails);
    }

    @Test
    void deleteDeviceFromUser_correctlyCallsRepository() {
        UUID userId = UUID.randomUUID();
        UUID deviceId = UUID.randomUUID();

        victim.deleteDeviceFromUser(userId, deviceId);

        verify(repository).deleteDeviceFromUser(userId, deviceId);
    }

    private User prepareUserBuilder() {
        User.UserBuilder builderMock = mock(User.UserBuilder.class);
        User expectedUser = randomUser();

        when(builderMock.username(expectedUser.getUsername())).thenReturn(builderMock);
        when(builderMock.email(expectedUser.getEmail())).thenReturn(builderMock);
        when(builderMock.password(expectedUser.getPassword())).thenReturn(builderMock);
        when(builderMock.createdAt(any())).thenReturn(builderMock);
        when(builderMock.role(expectedUser.getRole())).thenReturn(builderMock);
        when(builderMock.deviceIds(expectedUser.getDeviceIds())).thenReturn(builderMock);
        when(builderMock.build()).thenReturn(expectedUser);

        mockStatic(User.class);
        when(User.builder()).thenReturn(builderMock);

        when(passwordEncoder.encode(expectedUser.getPassword())).thenReturn(expectedUser.getPassword());
        when(repository.save(expectedUser)).thenReturn(expectedUser);

        return expectedUser;
    }
}