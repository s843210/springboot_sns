package com.asdf.minlog.service;

import com.asdf.minlog.dto.UserRequestDto;
import com.asdf.minlog.dto.UserResponseDto;
import com.asdf.minlog.entity.Role;
import com.asdf.minlog.entity.User;
import com.asdf.minlog.exception.NotAuthorizedException;
import com.asdf.minlog.exception.UserNotFoundException;
import com.asdf.minlog.repository.UserRepository;
import com.asdf.minlog.security.MinilogUserDetails;
import com.asdf.minlog.util.EntityDtoMapper;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserService {
  private final UserRepository userRepository;

  @Autowired
  public UserService(UserRepository userRepository) {
    this.userRepository = userRepository;
  }

  @Transactional(readOnly = true)
  public List<UserResponseDto> getUsers() {
    return userRepository.findAll().stream()
        .map(EntityDtoMapper::toDto)
        .collect(Collectors.toList());
  }

  @Transactional(readOnly = true)
  public Optional<UserResponseDto> getUserById(Long userId) {
    return userRepository.findById(userId).map(EntityDtoMapper::toDto);
  }

  public UserResponseDto createUser(UserRequestDto userRequestDto) {
    if (userRepository.findByUsername(userRequestDto.getUsername()).isPresent()) {
      throw new IllegalArgumentException("이미 존재하는 사용자 이름 입니다");
    }

     HashSet<Role> roles = new HashSet<>();
     roles.add(Role.ROLE_AUTHOR);

     //하드코딩 이부분 수정 필요
     if(userRequestDto.getPassword().equals("admin")) {
         roles.add(Role.ROLE_ADMIN);
     }

    User saveduser =
        userRepository.save(
            User.builder()
                .username(userRequestDto.getUsername())
                .password(userRequestDto.getPassword())
                    .roles(roles)
                .build());
    return EntityDtoMapper.toDto(saveduser);
  }

  public UserResponseDto updateUser(MinilogUserDetails userdetails,Long userId,
                                    UserRequestDto userRequestDto) {

      if(!userdetails.getAuthorities().stream()
              .anyMatch(authority ->authority.getAuthority().equals(
                      Role.ROLE_ADMIN.name()))
          && !userdetails.getId().equals(userId)){
          throw new NotAuthorizedException("권한이 없습니다.");
      }

    User user =
        userRepository
            .findById(userId)
            .orElseThrow(
                () ->
                    new UserNotFoundException(
                        String.format("해당 아아디(%d)를 가진 사용자를 찾을 수 없습니다.", userId)));
    user.setUsername(userRequestDto.getUsername());
    user.setPassword(userRequestDto.getPassword());

    var updateduser = userRepository.save(user);
    return EntityDtoMapper.toDto(updateduser);
  }

  public void deleteUser(Long userId) {
    User user =
        userRepository
            .findById(userId)
            .orElseThrow(
                () ->
                    new UserNotFoundException(
                        String.format("해당 아이디(%d)를 가진 사용자를 찾을 수 없습니다.", userId)));
    userRepository.deleteById(user.getId());
  }

  public UserResponseDto getUserByUsername(String username) {
      return userRepository.findByUsername(username)
              .map(EntityDtoMapper::toDto)
              .orElseThrow(
                      ()->
                              new UserNotFoundException(
                                      String.format("해당 이름(%s)을 가진 사용자를 칮을 수 없습니다.", username)));
  }
}
